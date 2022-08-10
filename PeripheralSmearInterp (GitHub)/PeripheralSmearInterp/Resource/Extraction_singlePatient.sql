--labs
drop table if exists #labExtract
select p.patientsid, i.TestId, t.labchemtestname, o.topography Specimen, LabChemResultValue, Inequality, Number, c.reflow, c.refhigh, c.Units, labchemcompletedatetime SpecimenDate
into #labExtract
from [DOEx].[Chem_PatientLabChem_SPV_ColumnIndex] c
join (select PatientSID from [Bashar].[Consult_List] where CPRSStatus = 'PENDING' and PATIENTSID = 1400540020) p on p.patientsid = c.patientsid
join dim.testid i on i.labchemtestsid = c.labchemtestsid and i.TopographySID = c.TopographySID
join cdwwork.dim.labchemtest t on c.labchemtestsid = t.labchemtestsid
join cdwwork.dim.topography o on o.topographysid = c.topographysid
where c.labchemcompletedatetime >= dateadd(year, -1, getdate())
and i.TestId in ('461023','435670','415369','529994','441981','468014','486166','682400','682400','409934','415413','468027','475787','456225','419662','459578','411231','470551','419447','425329','454495','433309','483320','559260','413565','419678','465969','445101','408720','425336','462914','449664','405761','413576','483341','414555','412980','432484','486165','415265','412288','430391','597383','597384','406485','529994','459522')
order by LabChemCompleteDateTime

drop table if exists #labTransform
select Patientsid, Labchemtestname, Specimen, LabChemResultValue, Reflow, Refhigh, Units, FORMAT(SpecimenDate, 'MMM dd yyyy hh:mm tt') SpecimenDate, TestId
into #labTransform
from (
	select *, row_number() over(partition by PatientSID, TestId order by SpecimenDate desc) Rn
	from #labExtract
) t
where rn = 1

--demographics
drop table if exists #demo
select p.PatientSID, PatientName, Last4, p.Age, p.Gender, right(p.ConsultReason, len(ConsultReason)-31) ConsultReason
into #demo
from [Bashar].[Consult_List] p 
where CPRSStatus = 'PENDING' and PATIENTSID = 1400540020


--medications
IF OBJECT_ID('tempdb..#NationalDrugs', 'U') IS NOT NULL DROP TABLE #NationalDrugs
select *
into #NationalDrugs
from (
	select NationalDrugSID, Sta3n, DrugNameWithDose, VADrugPrintName, 'medIron' Medication
	from cdwwork.Dim.NationalDrug
	where sta3n = 689 --West Haven
	and (DrugNameWithDose like '%iron%' or DrugNameWithDose like '%ferrous%')
	--debug only: and (VADrugPrintName not like '%spironolactone%' and VADrugPrintName not like '%buspirone%') --<--contain 'iron'
	--or DrugNameWithDose like '%fe%' --<-- not specific
) t

drop table if exists #meds
select * 
into #meds
from (
	select p.PatientSID, Medication, VADrugPrintName, FORMAT(o.IssueDate, 'MMM dd yyyy') issueDate, o.RxStatus
		, row_number() over(partition by p.PatientSID, Medication order by IssueDate desc) Rn
	from [Bashar].[Consult_List] p
	join cdwwork.[RxOut].[RxOutpat] o on p.PatientSID = o.PatientSID
	join #NationalDrugs n on n.NationalDrugSID = o.NationalDrugSID
	where o.IssueDate >= dateadd(year, -2, getdate())							--within 2 years
	and o.sta3n = 689															--West Haven, CT
	and o.RxStatus = 'Active'													--outpatient prescription active
	and p.CPRSStatus = 'PENDING'												--consult pending
	and P.PATIENTSID = 1400540020
) t
where Rn = 1

--join together
select * 
from (
	select PatientSID, 'Lab' Domain,
		cast(Labchemtestname as varchar(250))		Column1,
		cast(LabChemResultValue as varchar(250))	Column2, 
		cast(Reflow as varchar(250))				Column3, 
		cast(Refhigh as varchar(250))				Column4, 
		cast(Units as varchar(250))					Column5, 
		cast(SpecimenDate as varchar(250))			Column6,
		cast(TestId as varchar(250))				Column7,
		cast(Specimen as varchar(250))				Column8
	from #labTransform l

	union all

	select PatientSID, 'Demographics' Domain, PatientName, Last4, cast(Age as varchar(250)) Age, Gender, ConsultReason, null, null, null
	from #demo

	union all

	select PatientSID, 'Med' Domain,
		cast(Medication as varchar(250)) Column1, 
		cast(VADrugPrintName as varchar(250)) Column2, 
		cast(IssueDate as varchar(250)) Column3, 
		cast(RxStatus as varchar(250)) Column4,
		null Column5, null Column6, null Column7, null Column8
	from #meds
) t
order by PatientSID
