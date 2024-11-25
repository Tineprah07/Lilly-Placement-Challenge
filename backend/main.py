import os
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

"""
This module defines a FastAPI application for managing a list of medicines.
It provides endpoints to retrieve all medicines, retrieve a single medicine by name,
and create a new medicine.
Endpoints:
- GET /medicines: Retrieve all medicines from the data.json file.
- GET /medicines/{name}: Retrieve a single medicine by name from the data.json file.
- POST /create: Create a new medicine with a specified name and price.
- POST /update: Update the price of a medicine with a specified name.
- DELETE /delete: Delete a medicine with a specified name.
Functions:
- get_all_meds: Reads the data.json file and returns all medicines.
- get_single_med: Reads the data.json file and returns a single medicine by name.
- create_med: Reads the data.json file, adds a new medicine, and writes the updated data back to the file.
- update_med: Reads the data.json file, updates the price of a medicine, and writes the updated data back to the file.
- delete_med: Reads the data.json file, deletes a medicine, and writes the updated data back to the file.
Usage:
Run this module directly to start the FastAPI application.
"""
import uvicorn
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve the absolute path to the frontend directory
current_dir = os.path.dirname(os.path.abspath(__file__))  # Directory of main.py
frontend_dir = os.path.join(current_dir, "../frontend")

# Check and mount the frontend directory
if not os.path.exists(frontend_dir):
    raise RuntimeError(f"Frontend directory '{frontend_dir}' does not exist!")
app.mount("/frontend", StaticFiles(directory=frontend_dir, html=True), name="frontend")

# Path to the data.json file
data_file_path = os.path.join(current_dir, "data.json")

@app.get("/medicines")
def get_all_meds():
    """
    This function reads the data.json file and returns all medicines.
    Returns:
        dict: A dictionary of all medicines
    """
    file_path = os.path.join(current_dir, "data.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="data.json file not found")

    with open(file_path, "r") as meds:
        data = json.load(meds)
    return {"medicines": data["medicines"]}


@app.get("/medicines/{name}")
def get_single_med(name: str):
    """
    This function reads the data.json file and returns a single medicine by name.
    Args:
        name (str): The name of the medicine to retrieve.
    Returns:
        dict: A dictionary containing the medicine details
    """
    file_path = os.path.join(current_dir, "data.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="data.json file not found")

    with open(file_path, "r") as meds:
        data = json.load(meds)
        for med in data["medicines"]:
            if med["name"].lower() == name.lower():
                return med
    raise HTTPException(status_code=404, detail=f"Medicine '{name}' not found")


@app.post("/create")
def create_med(name: str = Form(...), price: float = Form(...)):
    """
    This function creates a new medicine with the specified name and price.
    It expects the name and price to be provided as form data.
    Args:
        name (str): The name of the medicine.
        price (float): The price of the medicine.
    Returns:
        dict: A message confirming the medicine was created successfully.
    """
    file_path = os.path.join(current_dir, "data.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="data.json file not found")

    with open(file_path, "r+") as meds:
        current_db = json.load(meds)
        for med in current_db["medicines"]:
            if med["name"].lower() == name.lower():
                raise HTTPException(status_code=400, detail=f"Medicine '{name}' already exists")

        new_med = {"name": name, "price": price}
        current_db["medicines"].append(new_med)
        meds.seek(0)
        json.dump(current_db, meds)
        meds.truncate()

    return {"message": f"Medicine '{name}' created successfully"}


@app.post("/update")
def update_med(name: str = Form(...), price: float = Form(...)):
    """
    This function updates the price of a medicine with the specified name.
    It expects the name and price to be provided as form data.
    Args:
        name (str): The name of the medicine.
        price (float): The new price of the medicine.
    Returns:
        dict: A message confirming the medicine was updated successfully.
    """
    file_path = os.path.join(current_dir, "data.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="data.json file not found")

    with open(file_path, "r+") as meds:
        current_db = json.load(meds)
        for med in current_db["medicines"]:
            if med["name"].lower() == name.lower():
                med["price"] = price
                meds.seek(0)
                json.dump(current_db, meds)
                meds.truncate()
                return {"message": f"Medicine '{name}' updated successfully"}
    raise HTTPException(status_code=404, detail=f"Medicine '{name}' not found")


@app.delete("/delete")
def delete_med(name: str = Form(...)):
    """
    This function deletes a medicine with the specified name.
    It expects the name to be provided as form data.
    Args:
        name (str): The name of the medicine to delete.
    Returns:
        dict: A message confirming the medicine was deleted successfully.
    """
    file_path = os.path.join(current_dir, "data.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="data.json file not found")

    with open(file_path, "r+") as meds:
        current_db = json.load(meds)
        for med in current_db["medicines"]:
            if med["name"].lower() == name.lower():
                current_db["medicines"].remove(med)
                meds.seek(0)
                json.dump(current_db, meds)
                meds.truncate()
                return {"message": f"Medicine '{name}' deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Medicine '{name}' not found")

# Add your average function here
@app.get("/medicines/average")
def get_average_price():
    """
    This function calculates the average price of all medicines.
    Returns:
        dict: A dictionary containing the average price.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))  # Directory of main.py
    file_path = os.path.join(base_dir, "data.json")  # Path to data.json

    # Open and read the file
    if not os.path.exists(file_path):
        return {"error": "data.json file not found"}

    with open(file_path, "r") as meds:
        data = json.load(meds)

    # Ensure there are medicines to calculate the average
    if "medicines" in data and len(data["medicines"]) > 0:
        total_price = sum(med["price"] for med in data["medicines"] if "price" in med)
        average_price = total_price / len(data["medicines"])
        return {"average_price": average_price}
    else:
        return {"error": "No medicines available to calculate the average"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)