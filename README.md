# infs2822-20t3-m18a-teamG

## Purpose

This project is for the visualisation of arbitrary columns and summary statistics from an ABS Census Datapack in a cloropleth. Personas have also been created on summarising figures from multiple columns to discover areas in which vulnerable populations may exist in higher densities.

The original use-case for this is then meant to be to guide decision-making based on multiple criteria, and generate visual reinforcement for presentations.

## Installation

Create a python virtual environment and use the package manager [pip](https://pip.pypa.io/en/stable/) to install required packages:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install javascript dependencies with [yarn](https://yarnpkg.com/):

```bash
cd web/static
yarn install
```

## Usage

```bash
export FLASK_APP=app.py
flask run
```

## Data
Data in the repository has already been processed and is ready to visualise in leaflet. Datasources can be found on the ABS census datapacks site [here](https://datapacks.censusdata.abs.gov.au/datapacks/).

Shapefiles can be found [here](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.003July%202016?OpenDocument), under "Postal Areas ASGS Ed 2016 Digital Boundaries in ESRI Shapefile Format". Geopandas can be used to convert the shapefiles to geojson.

[Mapshaper](https://www.npmjs.com/package/mapshaper) can be used to compress the geojson file.

## Contributors and Details

This is the group assignment submission for T32020 INFS2822 M18A Team G. Team Members are Kevin Zhong, Albert Dai, Helen Liang, Junaid Javeed.

This code has two main components, Python, used for data manipulation, and HTML/CSS/Javascript for visualisation.

## Acknowledgements

Thanks goes out the Australian Bureau of Statistics for the datasets and shapefiles, and to Blair Wang and Matthew Perry for the great course.
