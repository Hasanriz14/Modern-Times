from fastapi import FastAPI, HTTPException,Query,Request,Header
from fastapi.responses import HTMLResponse ,JSONResponse
from fastapi.staticfiles import StaticFiles
import json
import requests
import cachetools


app = FastAPI()

cache = cachetools.LRUCache(maxsize=200)
app.mount("/static",StaticFiles(directory="static"),name="static")
app.mount("/assets",StaticFiles(directory="assets"),name="assets")

valid_sections = ["home","world","business","technology","sports","politics","health","movies"]

section_mapping = {
"home": "home",
"world": "world",
"business": "business",
"technology": "technology",
"sports": "sports",
"health": "health",
"movies" : "movies",
"politics" : "politics"
}


@app.get("/")
async def read_html():
    return HTMLResponse(open("static/index.html").read())


@app.get("/content")
async def content_page():
    return HTMLResponse(open("static/content.html").read())

@app.get("/data/{section}")
async def get_data(section: str,page: int = Query(1,ge =1),size: int= Query(10,ge=1,le=100),api : str = Header(None)):
    if not api:
        raise HTTPException(status_code=400 , detail="API key is not provided")

    if section not in valid_sections:
        raise HTTPException(status_code=404,detail="Section Not Found")

    cache_key = f"{section}-{page}-{size}"
    if cache_key in cache:
        return JSONResponse(content=cache[cache_key])
    nyt_section = section_mapping.get(section,section)

    URL = f"https://api.nytimes.com/svc/topstories/v2/{nyt_section}.json"
    PAYLOAD = {"api-key": api}

    try:
        response = requests.get(url=URL,params=PAYLOAD)
        response.raise_for_status()
    except requests.RequestException as e :
        raise HTTPException(status_code=500,detail="API request Failed")
    
    json_data = response.json()

    results = json_data.get('results',[])
    start = (page - 1) * size
    end = start  + size
    paginated_results = results[start:end]

    data  = {
        "status" : json_data.get("status"),
        "results" : paginated_results,
        "total_results" : len(results),
        "current_page" : page,
        "total_pages" : (len(results) + size -1) #size 
    }
    cache[cache_key] = data
    return JSONResponse(content=data)

@app.get("/categories")
async def get_categories():
    return JSONResponse(content=valid_sections)
