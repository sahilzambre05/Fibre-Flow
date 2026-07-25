# Deploying to Render + Vercel

This project deploys as two services on Render and one frontend on Vercel:

```text
Vercel React app → Render Spring Boot API → Render private FastAPI inference service
```

## 1. Store the model with Git LFS

`grade_change_ai.pkl` is approximately 364 MB. GitHub blocks normal Git files above 100 MB, so install and enable Git LFS before the first push:

```bash
git lfs install
git add .gitattributes grade_change_ai.pkl
git add .
git commit -m "Prepare Render and Vercel deployment"
```

Verify `git lfs ls-files` lists `grade_change_ai.pkl`. Do not add the model to `.gitignore`: Render needs it while starting the FastAPI service.

## 2. Deploy the backend with Render

1. Push the repository to GitHub with the LFS model uploaded.
2. In Render, select **New → Blueprint** and choose the repository.
3. Render reads `render.yaml` and creates:
   - `paper-ai-fastapi`: a private FastAPI model-inference service.
   - `paper-backend-springboot`: the public Spring Boot API.
4. Deploy the Blueprint and wait for both health checks to pass.
5. Copy the public URL of `paper-backend-springboot`, for example `https://paper-backend-springboot.onrender.com`.

The Spring service uses Render's dynamic `PORT`; it connects to FastAPI over Render's private network. The public API health endpoint is:

```text
https://your-render-backend.onrender.com/api/grade-change/health
```

## 3. Deploy the frontend with Vercel

1. Import the same GitHub repository in Vercel.
2. Set **Root Directory** to `frontend` and choose the **Vite** preset.
3. Add this environment variable for Production, Preview, and Development as appropriate:

```text
VITE_BACKEND_URL=https://your-render-backend.onrender.com
```

Use the copied public Spring Boot URL, with no trailing slash. The checked-in `frontend/.env.example` is only a template; do not commit a real `.env` file.
4. Deploy. Vercel will run `npm run build` and publish `frontend/dist`.

## Verification

- Open the Vercel URL and generate a transition plan.
- Check that both status indicators turn online after the Render services finish starting.
- If the model is loading or a free Render instance is waking up, the UI uses its existing simulation fallback temporarily.