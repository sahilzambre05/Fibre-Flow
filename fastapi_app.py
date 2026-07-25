import time
from datetime import datetime
from contextlib import asynccontextmanager
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Global model container
model = None

MODEL_PATH = "grade_change_ai.pkl"

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        print(f"Loading AI model from {MODEL_PATH}...")
        start = time.time()
        model = joblib.load(MODEL_PATH)
        elapsed = time.time() - start
        print(f"Model loaded successfully in {elapsed:.2f} seconds.")
    except Exception as e:
        print(f"Failed to load model from {MODEL_PATH}: {str(e)}")
        raise e
    yield
    print("Shutting down FastAPI AI service...")

app = FastAPI(
    title="Paper Machine Grade Change AI Service",
    description="Microservice providing machine parameter predictions for paper grade changes",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local testing and Spring Boot / React interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GradeChangeInput(BaseModel):
    currentGrade: float = Field(..., description="Current paper grade code (e.g., 80)")
    targetGrade: float = Field(..., description="Target paper grade code (e.g., 120)")
    basisWeight: float = Field(..., description="Current basis weight (g/m2)")
    stockFlow: float = Field(..., description="Current stock flow rate (L/min)")
    steamPressure: float = Field(..., description="Current dryer steam pressure (kPa)")
    machineSpeed: float = Field(..., description="Current machine speed (m/min)")
    moisture: float = Field(..., description="Current paper moisture percentage (%)")
    ash: float = Field(..., description="Current ash content percentage (%)")
    fillerFlow: float = Field(..., description="Current filler flow rate (L/min)")

class GradeChangePrediction(BaseModel):
    nextBasisWeight: float
    nextStockFlow: float
    nextSteamPressure: float
    nextMachineSpeed: float
    nextMoisture: float
    nextAsh: float
    nextFillerFlow: float
    modelConfidence: float
    estimatedTransitionTimeMinutes: float
    timestamp: str

@app.get("/")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "Paper Grade Change AI Service",
        "modelLoaded": model is not None
    }

@app.post("/predict", response_model=GradeChangePrediction)
def predict(input_data: GradeChangeInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    try:
        # Construct feature vector in exact expected feature order:
        # CurrentGrade, TargetGrade, BasisWeight, StockFlow, SteamPressure, MachineSpeed, Moisture, Ash, FillerFlow
        features = np.array([[
            input_data.currentGrade,
            input_data.targetGrade,
            input_data.basisWeight,
            input_data.stockFlow,
            input_data.steamPressure,
            input_data.machineSpeed,
            input_data.moisture,
            input_data.ash,
            input_data.fillerFlow
        ]], dtype=np.float64)

        # Predict next parameters
        prediction_arr = model.predict(features)
        pred = prediction_arr[0]

        # Calculate model confidence via tree-variance across estimators if available
        confidence = 95.0
        if hasattr(model, "estimators_") and len(model.estimators_) > 0:
            try:
                tree_preds = np.array([t.predict(features)[0] for t in model.estimators_]) # shape: (n_trees, 7)
                std_preds = np.std(tree_preds, axis=0) # std for each predicted parameter
                # Compute relative standard deviation ratio
                relative_std = np.mean(std_preds / (np.abs(pred) + 1e-5))
                # Map to confidence percentage between 85% and 99.5%
                confidence = float(np.clip(100.0 - (relative_std * 50.0), 85.0, 99.5))
            except Exception:
                confidence = 94.5

        # Estimate transition duration based on grade delta and speed
        grade_delta = abs(input_data.targetGrade - input_data.currentGrade)
        estimated_time = round(max(8.0, min(45.0, 10.0 + (grade_delta * 0.25))), 1)

        return GradeChangePrediction(
            nextBasisWeight=round(float(pred[0]), 2),
            nextStockFlow=round(float(pred[1]), 2),
            nextSteamPressure=round(float(pred[2]), 2),
            nextMachineSpeed=round(float(pred[3]), 2),
            nextMoisture=round(float(pred[4]), 2),
            nextAsh=round(float(pred[5]), 2),
            nextFillerFlow=round(float(pred[6]), 2),
            modelConfidence=round(confidence, 1),
            estimatedTransitionTimeMinutes=estimated_time,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8000, reload=True)
