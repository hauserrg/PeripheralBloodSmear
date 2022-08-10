--Remove old VISTA consults
delete from Bashar.Consult_List where ConsultSID < 100

--Add new VISTA consults
insert into Bashar.Consult_List
select p.PatientName, v.Last4, p.Age, p.Gender, p.PatientSID, ConsultDate RequestDateTime, v.CPRSStatus,
	row_number() over(partition by 1 order by v.LastName, v.FirstInitial, v.Last4) ConsultSID, null InpatOutpat, null ProvisionalDiagnosis, null ConsultReason
from Bashar.Consult_List_FromVista v
join cdwwork.spatient.spatient p on right(p.PatientSSN,4) = v.last4 and p.PatientLastname = v.lastName and left(p.PatientFirstName,1) = v.FirstInitial
left join Bashar.Consult_List cl on cl.PatientSID = p.PatientSID and cast(cl.RequestDateTime as date) = v.ConsultDate --do not add existing consults
where p.sta3n = 689 
and cl.PatientSID is null --do not add existing consults
