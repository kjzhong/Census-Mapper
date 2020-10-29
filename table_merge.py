import numpy as np
import pandas as pd

data1 = pd.read_csv("2016 Census GCP Postal Areas for NSW/2016Census_G15_NSW_POA.csv")
data2 = pd.read_csv("2016 Census GCP Postal Areas for NSW/2016Census_G28_NSW_POA.csv")

data3 = pd.merge(data1,data2,on="POA_CODE_2016",how="inner")
print(data3.isnull().values.any())
data3
data3 = data3.transpose()

str1 = "POA_CODE_2016"
str2 = "Secondary_Tot_P" #Secondary_Total_Persons
str3 = "Tec_Furt_Educ_inst_Ft_15_24_P" #Technical_or_Further_Educational_institution_Full_time_student_Aged_15_24_years_Persons
str4 = "Tec_Furt_Educ_inst_Pt_15_24_P" #Technical_or_Further_Educational_institution_Part_time_student_Aged_15_24_years_Persons
str5 = "Tec_Furt_Educ_inst_F_Pt_ns_P" #Technical_or_Further_Educational_institution_Full_Part_time_student_status_not_stated_Persons
str6 = "Uni_othr_Tert_Inst_Ft_15_24_P" #University_or_other_Tertiary_Institution_Full_time_student_Aged_15_24_years_Persons
str7 = "Uni_othr_Tert_Inst_Pt_15_24_P" #University_or_other_Tertiary_Institution_Part_time_student_Aged_15_24_years_Persons
str8 = "Uni_othr_Tert_Inst_F_Pt_ns_P" #University_or_other_Tertiary_Institution_Full_Part_time_student_status_not_stated_Persons

# getting all the columns for income per week , i believe it is in "Total Families in postcode"
str9 = "Neg_Nil_inc_Tot" #Negative_Nil_income_Total
str10 = "FI_1_149_Tot" # 1 - 149
str11 = "FI_150_299_Tot" # 150 - 299
str12 = "FI_300_399_Tot" # 300 - 399
str13 = "FI_400_499_Tot"
str14 = "FI_500_649_Tot"
str15 = "FI_650_799_Tot"
str16 = "FI_800_999_Tot"
str17 = "FI_1000_1249_Tot" # we will get half of this amount for families under 1125, assume uniform dist.

l1=[]
for i in range(1,18):
    var_name = "str"+str(i)
    l1.append(eval(var_name))
#print l1


str_main= ("|".join(l1))
data4 = data3.filter(regex = str_main, axis = 0).transpose()
data4["FI_1000_1249_Tot"]=(data4["FI_1000_1249_Tot"]//2) #divide by 2 and round down
data4


data4["Total Students"] = data4.loc[:,"Secondary_Tot_P":"Uni_othr_Tert_Inst_F_Pt_ns_P"].sum(axis=1)
data4["Total Families Under Median"] = data4.loc[:,"Neg_Nil_inc_Tot":"FI_1000_1249_Tot"].sum(axis=1)
data4

data5 = data4.loc[:,["POA_CODE_2016","Total Students","Total Families Under Median"]] #can be extended
data5.sort_values(by=["Total Students","Total Families Under Median"],ascending=[True,True],inplace=True) #can be extended
data5 

data5.sort_values(by=["Total Families Under Median","Total Students"],ascending=[True,True],inplace=True) #can be extended
data5
