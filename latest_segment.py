#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
import functools


# ## Step 1: Importing the Data

# In[33]:


dataCols = ["01","02","04A","04B","10A","10B","10C","13A","13B","15","17A","17B","17C","18","25","28","30","31","57A","57B","59"]

names = []
d = {}
for i in range(len(dataCols)):
    name = "2016 Census GCP Postal Areas for NSW/2016Census_"+"G"+dataCols[i]+"_NSW_POA.csv"
    names.append(name)
    d["dataG" + str(dataCols[i])] = pd.read_csv(names[i])

#list(d.values())


# ## Step 2: Merge all of the tables by post code + checking missing data

# In[34]:


df_merged = functools.reduce(lambda  left,right: pd.merge(left,right,on=['POA_CODE_2016'],
                                            how='inner'), list(d.values()))

print(df_merged.isnull().values.any())
df_merged



# In[43]:


#fat CSV of all the Personas
personad={}
#General Stuff
personad["str1"]="POA_CODE_2016"

#Population Density
personad["str2"]="Tot_P_P"

#People aged 15-24
personad["str3"]="Age_15_19_yr_P"
personad["str4"]="Age_20_24_yr_P"

#People who immigrated from 2011 to 2016
personad["str5"]="Tot_2011"
personad["str6"]="Tot_2012"
personad["str7"]="Tot_2013"
personad["str8"]="Tot_2014"
personad["str9"]="Tot_2015"
personad["str10"]="Tot_2016"

#People over the age of 55 who need assitance with core activites/disabled
personad["str11"]="P_55_64_Need_for_assistance"
personad["str12"]="P_65_74_Need_for_assistance"
personad["str13"]="P_75_84_Need_for_assistance"
personad["str14"]="P_85_over_Need_for_assistance"

#Number of single parent families with children under 15
personad["str15"]="OPF_ChU15_a_Total_F"

#Households with less than one motor vehicle
personad["str16"]="Num_MVs_per_dweling_0_MVs"
personad["str17"]="Num_MVs_per_dweling_1_MVs"

#Households with more than 3 people ( can change this)
personad["a"]="Num_Psns_UR_3_Total"
personad["b"]="Num_Psns_UR_4_Total"
personad["c"]="Num_Psns_UR_5_Total"
personad["d"]="Num_Psns_UR_6mo_Total"
#personad["str18"]="Average_household_size" #Can we utilise this?

#Indigenous Australians
personad["str"]="Indigenous_P_Tot_P"

#Sole method to work is taxi
personad["chj"]="One_method_Taxi_P"


# In[40]:


#Persona 1

#Subsetting the relevant rows
persona1_table = df_merged.loc[:,personad.values()]

#Merging and dropping number of 15-24 y.o.
persona1_table["Number of 15-24 Year Olds"] = persona1_table.loc[:,"Age_15_19_yr_P":"Age_20_24_yr_P"].sum(axis=1) ## keep
persona1_table.drop(columns=persona1_table.loc[:,"Age_15_19_yr_P":"Age_20_24_yr_P"],inplace = True)

#Merging and dropping number of immigrants since 2011
persona1_table["Total Number Of Immigrants since 2011"]=persona1_table.loc[:,"Tot_2011":"Tot_2016"].sum(axis=1)
persona1_table.drop(columns=persona1_table.loc[:,"Tot_2011":"Tot_2016"],inplace = True)

#Merging and dropping 55 and older who need assistance with core activites
persona1_table["55 and Older who need assistance (disabled)"]=persona1_table.loc[:,"P_55_64_Need_for_assistance":"P_85_over_Need_for_assistance"].sum(axis=1)
persona1_table.drop(columns=persona1_table.loc[:,"P_55_64_Need_for_assistance":"P_85_over_Need_for_assistance"],inplace = True)

#Merging and dropping Households with 1 or less cars
persona1_table["Number of households with 1 or less cars"]=persona1_table.loc[:,"Num_MVs_per_dweling_0_MVs":"Num_MVs_per_dweling_1_MVs"].sum(axis=1)
persona1_table.drop(columns=persona1_table.loc[:,"Num_MVs_per_dweling_0_MVs":"Num_MVs_per_dweling_1_MVs"],inplace = True)

#Merging and dropping households with 3 or more people
persona1_table["Number of Households with more than 3 people"]=persona1_table.loc[:,"Num_Psns_UR_3_Total":"Num_Psns_UR_6mo_Total"].sum(axis=1)
persona1_table.drop(columns=persona1_table.loc[:,"Num_Psns_UR_3_Total":"Num_Psns_UR_6mo_Total"],inplace = True)

persona1_table.rename(columns={'OPF_ChU15_a_Total_F': 'Single Parent Families with Children under 15'
                               , 'Tot_P_P': 'Total Population'
                               , 'Indigenous_P_Tot_P':'Total Indigenous Population'
                               , 'One_method_Taxi_P':"Only method to work is Taxi"
                               }, inplace=True)

persona1_table


# In[48]:


persona1_table.to_excel('Chicken nugget.xlsx', index = False)

