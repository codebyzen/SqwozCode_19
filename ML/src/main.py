import json
import logging
from fastapi import FastAPI

from src.classes.ML_model_recommend_groups import mrg
from src.classes.ML_model_recommend_similar_item import mrs
from src.classes.ML_model_recommend_neighbors import mrn


logger = logging.getLogger("uvicorn.error")


app = FastAPI()

@app.get("/api")
def hello(ml: str, id: int):
	# logger.info(os.getcwd())
	if (ml=="mrg"):
		mrg_object = mrg() # 101400129
		recomendation = mrg_object.init(id)
		return json.dumps(recomendation)
	
	if (ml=="mrs"):
		mrs_object = mrs()
		recomendation = mrs_object.init(id) # 324
		return json.dumps(recomendation, ensure_ascii=False)
	
	if (ml=="mrn"):
		mrn_object = mrn()
		recomendation = mrn_object.init(id) # 101361748
		return json.dumps(recomendation, ensure_ascii=False)
