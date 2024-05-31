from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from rembg import remove
from PIL import Image
import io
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/remove-background")
async def remove_background(image: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await image.read()

        # Load the image using PIL
        input_image = Image.open(io.BytesIO(contents))

        # Remove the background
        output_image = remove(input_image)

        # Save the processed image to a BytesIO object
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG")
        output_buffer.seek(0)

        # Return the processed image as a StreamingResponse
        return StreamingResponse(output_buffer, media_type="image/png")
    
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")