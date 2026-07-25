package com.paper.gradechange.dto;

public class GradeChangeResponseDTO {

    private Double nextBasisWeight;
    private Double nextStockFlow;
    private Double nextSteamPressure;
    private Double nextMachineSpeed;
    private Double nextMoisture;
    private Double nextAsh;
    private Double nextFillerFlow;
    private Double modelConfidence;
    private Double estimatedTransitionTimeMinutes;
    private String timestamp;

    public GradeChangeResponseDTO() {}

    public GradeChangeResponseDTO(Double nextBasisWeight, Double nextStockFlow, Double nextSteamPressure,
                                  Double nextMachineSpeed, Double nextMoisture, Double nextAsh, Double nextFillerFlow,
                                  Double modelConfidence, Double estimatedTransitionTimeMinutes, String timestamp) {
        this.nextBasisWeight = nextBasisWeight;
        this.nextStockFlow = nextStockFlow;
        this.nextSteamPressure = nextSteamPressure;
        this.nextMachineSpeed = nextMachineSpeed;
        this.nextMoisture = nextMoisture;
        this.nextAsh = nextAsh;
        this.nextFillerFlow = nextFillerFlow;
        this.modelConfidence = modelConfidence;
        this.estimatedTransitionTimeMinutes = estimatedTransitionTimeMinutes;
        this.timestamp = timestamp;
    }

    public Double getNextBasisWeight() { return nextBasisWeight; }
    public void setNextBasisWeight(Double nextBasisWeight) { this.nextBasisWeight = nextBasisWeight; }

    public Double getNextStockFlow() { return nextStockFlow; }
    public void setNextStockFlow(Double nextStockFlow) { this.nextStockFlow = nextStockFlow; }

    public Double getNextSteamPressure() { return nextSteamPressure; }
    public void setNextSteamPressure(Double nextSteamPressure) { this.nextSteamPressure = nextSteamPressure; }

    public Double getNextMachineSpeed() { return nextMachineSpeed; }
    public void setNextMachineSpeed(Double nextMachineSpeed) { this.nextMachineSpeed = nextMachineSpeed; }

    public Double getNextMoisture() { return nextMoisture; }
    public void setNextMoisture(Double nextMoisture) { this.nextMoisture = nextMoisture; }

    public Double getNextAsh() { return nextAsh; }
    public void setNextAsh(Double nextAsh) { this.nextAsh = nextAsh; }

    public Double getNextFillerFlow() { return nextFillerFlow; }
    public void setNextFillerFlow(Double nextFillerFlow) { this.nextFillerFlow = nextFillerFlow; }

    public Double getModelConfidence() { return modelConfidence; }
    public void setModelConfidence(Double modelConfidence) { this.modelConfidence = modelConfidence; }

    public Double getEstimatedTransitionTimeMinutes() { return estimatedTransitionTimeMinutes; }
    public void setEstimatedTransitionTimeMinutes(Double estimatedTransitionTimeMinutes) { this.estimatedTransitionTimeMinutes = estimatedTransitionTimeMinutes; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
