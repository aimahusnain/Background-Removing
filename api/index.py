from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from rembg import remove
from PIL import Image
import io
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/remove-background")
async def remove_background(image: UploadFile = File(...)):
        contents = await image.read()

        input_image = Image.open(io.BytesIO(contents))

        output_image = remove(input_image)

        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG")
        output_buffer.seek(0)

        return StreamingResponse(output_buffer, media_type="image/png")