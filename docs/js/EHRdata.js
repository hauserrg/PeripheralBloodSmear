//EHRdata should not no empty strings. "nulls" are used instead.

class EHRdata {
  static patientName = "This Patient Name";
  static last4 = "0412";
  static age = 53;
  static sex = "male";
  static reasonForConsult = "anemia";

  // === null, to find lab not available
  static hematocrit = new Lab("hematocrit", 40, "%", "May 1, 2022 05:25", "39.2", "50.4");
  static ReticulocytesPct = new Lab("ReticulocytesPct", 1, "%", "May 1, 2022", "0.5", "2.5");
  
  static Eosinophils = new Lab("Eosinophils", 5.0, "%", "May 1, 2022", "0.4", "6.8");
  static MCV = new Lab("MCV", 90, "fL", "May 1, 2022", "82", "99");
  static WBCs = new Lab("WBCs", 5.4, "K/cmm", "May 1, 2022", "4.5", "11.0");
  static Neutrophils = new Lab("Neutrophils", 51.5, "%", "May 1, 2022", "43.7", "75.8");
  static Basophils = new Lab("Basophils", 0.7, "%", "May 1, 2022", "0.1", "2.0");
  static hemoglobin = new Lab("hemoglobin", 14.6, "g/dL", "May 1, 2022", "12.8", "17.0");
  static Platelets = new Lab("Platelets", 290, "K/cmm", "May 1, 2022", "140", "360");
  static Lymphocytes = new Lab("Lymphocytes", 16, "%", "May 1, 2022", "14.0", "42.3");
  static NeutrophilsAbs = new Lab("NeutrophilsAbs", 2.3, "K/cmm", "May 1, 2022", "2.2", "7.6");
  static MCH = new Lab("MCH", 29.7, "pg", "May 1, 2022", "26.2", "32.6");
  static RDW = new Lab("RDW", 14, "%", "May 1, 2022", "12", "16");
  static RBCs = new Lab("RBCs", 5.11, "M/cmm", "May 1, 2022", "4.23", "5.66");
  static ImmatureGranulocytes = new Lab("ImmatureGranulocytes", 0.2, "%", "May 1, 2022", "0.0", "0.7");
  static NucleatedRBCs = new Lab("NucleatedRBCs", 0.0, "%/WBC", "May 1, 2022", "0.0", "0.0");
  static Monocytes = new Lab("Monocytes", 12.3, "%", "May 1, 2022", "5.1", "13.7");
  static MeanPlateletVolume  = new Lab("MeanPlateletVolume ", 9.9, "fL", "May 1, 2022", "9.2", "12.4");
  static MCHC = new Lab("MCHC", 30.9, "g/dL", "May 1, 2022", "30.8", "35.1");
  static LymphocytesAbs = new Lab("LymphocytesAbs", 1.2, "K/cmm", "May 1, 2022", "1.0", "3.2");
  static BilirubinTotal = new Lab("BilirubinTotal", 0.71, "mg/dL", "May 1, 2022", "0.2", "1.2");
  static BilirubinIndirect = new Lab("BilirubinIndirect", 0.3, "mg/dL", "May 1, 2022", "0.0", "0.5");
  static Ferritin = new Lab("Ferritin", 150, "ng/mL", "May 1, 2022", "20", "300");
  static Transferrin = new Lab("Transferrin", 212, "mg/dL", "May 1, 2022", "173", "382");
  static Iron = new Lab("Iron", 50, "ug/dL", "May 1, 2022", "40", "160");
  static B12 = new Lab("B12", 357, "pg/mL", "May 1, 2022", "300", "900");
  static folate = new Lab("Folate", 9.2, "ng/mL", "2022-06-27", "5.2", null);
  static TransferrinSaturation = new Lab("TransferrinSaturation", 40, "%", "May 1, 2022", "15", "45");
  static TIBC = new Lab("TIBC", 269, "ug/dL", "May 1, 2022", "204", "475");
  static hemoglobinElectrophoresis = new Lab("hemoglobinElectrophoresis", null, null, null, null, null);
  static ReticulocytesAbs = new Lab("ReticulocytesAbs", 2.0, "K/cmm", "May 1, 2022", "1", "3");
  static ImmatureReticulocytes = new Lab("ImmatureReticulocytes", null, null, null, null, null);
  static ReticulocyteHemoglobin = new Lab("ReticulocyteHemoglobin", null, null, null, null, null);
  static immaturePlateletFraction = new Lab("immaturePlateletFraction", 10, "", "May 1, 2022", "5", "15");
  static tsh = new Lab("tsh", 10, "", "May 1, 2022", "5", "15");
  static ft4 = new Lab("ft4", 10, "", "May 1, 2022", "5", "15"); //Free T4 (thyroxine)
  static ast = new Lab("ast", null, "", "May 1, 2022", "5", "15");
  static alt = new Lab("alt", null, "", "May 1, 2022", "5", "15");
  static creatinine = new Lab("creatinine", null, "", "May 1, 2022", "5", "15");
  //static urineBlood = new Lab("urineBlood", "3+", null, "2022-07-07 13:33:55", "Neg", null);
  static urineBlood = new Lab("urineBlood", "NEG", null, "2022-07-07 13:33:55", "NEG", null);
  static haptoglobin = new Lab("haptoglobin", 50, "mg/dL", "May 1, 2022", "20", "100");
  static LDH = new Lab("LDH", 90, "mg/dL", "May 1, 2022", "50", "200");
  //erythropoietin
  //C-reactive protein (anemia)`

  static rpi() {
    if(!(EHRdata.ReticulocytesPct.result === null || EHRdata.hematocrit.result === null)){
      var maturationFactor = -1;
      if(EHRdata.hematocrit.result >= 35){
        maturationFactor = 1.0;
      } else if(EHRdata.hematocrit.result >= 25){
        maturationFactor = 1.5;
      } else if(EHRdata.hematocrit.result >= 20){
        maturationFactor = 2.0;
      } else {
        maturationFactor = 2.5;
      }
      var rpiCalc = (EHRdata.ReticulocytesPct.result*(EHRdata.hematocrit.result/42))/maturationFactor;
      return rpiCalc;
    } else {
      return "";
    }
  }

  static mentzer() {
    if(!(EHRdata.MCV.result === null || EHRdata.RBCs.result === null)){
      var index = EHRdata.MCV.result / EHRdata.RBCs.result;
      return index;
    } else {
      return "";
    } 
  }
}
