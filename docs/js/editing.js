//Notes:

// changes:
// - platelets logic: no longer relies on ipf checkbox to work
// - checkbox format
// - checkbox availability guided by data

dev_enable = true;

class Phrase{
  constructor(){}
  
  //Header
  history = "   PERIPHERAL BLOOD SMEAR INTERPRETATION\r\n\r\nCLINICAL HISTORY/REASON FOR CONSULT: The patient is a " + EHRdata.age + "yo " + EHRdata.sex + " with a PMH of {...}. ";
  consult = "A consult was requested for '" + EHRdata.reasonForConsult + "'.\r\n\r\n";
  
  //Smear
  boolSchistocyte = false;
  boolflowCytometry = false;
  boolIpf = false;
  boolRpi = false;
  boolrequestRetics = false;
//   get rbc() {
//     var mcvInterp = EHRdata.MCV.isLow ? "Microcytic" : (EHRdata.MCV.isHigh ? "Macrocytic" : "Normocytic");
//     var mchcInterp = EHRdata.MCHC.isLow ? "hypochromic" : (EHRdata.MCHC.isHigh ? "hyperchromic" : "normochromic");
//     var hemoglobinInterp = EHRdata.hemoglobin.isLow ? "anemia. " : "erythrocytes. ";
//     return mcvInterp + ", " + mchcInterp +" "+ hemoglobinInterp;
//   } 
  
  //Impression
  //Note MDCalc round the absolute reticulocyte count to 1 decimal, there it may differ by one digit in the second decimal from this answer.
  //Test case: %retic 4.3, hematocrit 21%, normal hematocrit: 42%. Result 2.1 absolute retic count, 1.07 RPI. The function below will give 1.08.
  get rpiInterp(){
    if(EHRdata.ReticulocytesPct.result === null || EHRdata.hematocrit.result === null){
      return "";
    }
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
    
    //output
    if(rpiCalc < 2){
      return "The reticulocyte production index (RPI) is <2 (" + (Math.round(rpiCalc * 100) / 100).toString() + "), indicating a hypoproliferative marrow response. ";  
    } else if( rpiCalc >= 2){
      return "The reticulocyte production index (RPI) is >=2 (" + (Math.round(rpiCalc * 100) / 100).toString() + "), indicating an adequate marrow response. "; 
    }      
  }
  get microcyticInterp_mentzer(){
    if(EHRdata.MCV.result === null || EHRdata.RBCs.result === null){
      return "";
    }
    
    var index = EHRdata.MCV.result / EHRdata.RBCs.result;
    if(index > 13){
      return "The Mentzer index is >13 ("+(Math.round(index * 10) / 10).toString()+"), favoring iron deficiency over thalassemia trait. ";
    } else if(index < 13){
      return "The Mentzer index is <13 ("+(Math.round(index * 10) / 10).toString()+"), favoring thalassemia trait over iron deficiency. ";
    }
  }
  get microcyticInterp_ironStudies(){
    if(EHRdata.Ferritin.isLow && EHRdata.Transferrin.isHigh){
      return "The low ferritin and high transferrin suggest iron deficiency is more likely than ACD/AI. ";
    } else if(EHRdata.Ferritin.isHigh && EHRdata.Transferrin.isLow){
      return "The high ferritin and low transferrin suggest ACD/AI is more likely than iron deficiency. ";
    } else if(EHRdata.Ferritin.isNormal && EHRdata.Transferrin.isNormal && EHRdata.Iron.isNormal && EHRdata.TIBC.isNormal && EHRdata.TransferrinSaturation.isNormal){
      return "Iron studies are normal making iron deficiency and ACD/AI unlikely. "
    }
    //One is in the right direction, but the other is inconclusive. 	
    else {
      return "The iron studies are inconclusive at differentiating iron deficiency from ACD/AI as the ferritin is "+ EHRdata.Ferritin.lowOrHigh +" and the transferrin is " + EHRdata.Transferrin.lowOrHigh +". ";
    }
  }
  get microcyticInterp(){
    var lineOut = "Common causes of microcytic anemia include iron deficiency, thalassemia, and anemia of chronic disease/inflammation (ACD/AI). ";
    lineOut += EHRdata.hemoglobinElectrophoresis.result === null ? this.microcyticInterp_mentzer : EHRdata.hemoglobinElectrophoresis.result;
    lineOut += this.microcyticInterp_ironStudies;
    return lineOut;        
  }
  get normocyticInterp_TSH(){
    var lineOut = "";
    if(EHRdata.tsh.isHigh){
      //no FT4
      if(EHRdata.ft4.result === null){
        lineOut += "The patient has a high TSH and no recent free T4. Suggest free T4 (thyroxine) to evalaute for hypothyroidism.";
      } else if(EHRdata.ft4.isLow){
        //low FT4
        lineOut += "The patient has a high TSH and low free T4, which may cause a "+ EHRdata.MCV.isLow ? "microcytic" : (EHRdata.MCV.isHigh ? "macrocytic" : "normocytic") + " anemia. Thyroid replacement therapy may be warranted.";
      } else if(EHRdata.ft4.isNormal){
        //I think - https://pubmed.ncbi.nlm.nih.gov/22200582/
        lineOut += "The patient has a high TSH and normal free T4 (subclinical hypothyroidism), which may cause a " + EHRdata.MCV.isLow ? "microcytic" : (EHRdata.MCV.isHigh ? "macrocytic" : "normocytic") +"anemia. Thyroid replacement therapy may be warranted. ";
      }
    }
    if(EHRdata.tsh.isNormal){
      lineOut += "TSH is normal. "
    }
    return lineOut;
  }
  get b12FolateInterp() {
    //B12
    var lineOut = "";
    if(EHRdata.B12.result === null){      
    } else if(EHRdata.B12.isLow){
      lineOut += "B12 is low, which may cause "+ EHRdata.MCV.isHigh ? "macrocytic" : "normocytic" + " anemia. Consider B12 replacement therapy.";
    } else if(EHRdata.B12.isNormal){
      lineOut += "B12 is normal. ";
    }
    //folate
    if(EHRdata.folate.result === null && EHRdata.B12.result !== null){	  
      lineOut += "Recommend folate. ";
    } else if(EHRdata.folate.isLow){
      lineOut += "Folate is low, which may cause "+ EHRdata.MCV.isHigh ? "macrocytic" : "normocytic" + " anemia. Consider folate replacement therapy. ";
    } else if(EHRdata.folate.isNormal){
      lineOut += "Folate is normal. "
    }
    return lineOut;
  }
  get normocyticInterp(){
    var lineOut = "Common causes of normocytic anemia include iron deficiency, anemia of chronic disease/inflammation (ACD/AI), B12/folate deficiency, alcohol use, liver disease, hemolysis, and hypothyroidism. ";
    lineOut += this.b12FolateInterp;
    lineOut += this.normocyticInterp_TSH;
    lineOut += this.microcyticInterp_ironStudies;
    return lineOut;
  }
//   get cytopenias() {
//     var lineOut = "";
//     if( EHRdata.hemoglobin.isLow && EHRdata.WBCs.isLow && EHRdata.Platelets.isLow){
//       lineOut = "Pancytopenia is present with anemia, leukopenia, and thrombocytopenia. ";
//     } else if( EHRdata.hemoglobin.isLow && EHRdata.WBCs.isLow ){
//       lineOut = "Bicytopenia is present with anemia and leukopenia. ";
//     } else if( EHRdata.hemoglobin.isLow && EHRdata.Platelets.isLow ){
//       lineOut = "Bicytopenia is present with anemia and thrombocytopenia. ";      
//     } else if( EHRdata.WBCs.isLow && EHRdata.Platelets.isLow ){
//       lineOut = "Bicytopenia is present with leukopenia and thrombocytopenia. ";      
//     } else if(EHRdata.WBCs.isNormal){
//       lineOut = "Leukocytes are normal in number. Granulocytes display normal maturation. Lymphocytes are appropriately small and mature.  ";
//     }
    
//     return lineOut;
//   }
  get platelet(){
    //Platelet morphology
    var plateletMorphology = "";
    var morphology = "";
    $('input[name=ptlMorph]:checked', '#plateletMorph').each(function() {
      morphology = this.nextElementSibling.textContent.toLowerCase();
    });
    if( morphology == "normal"){
      plateletMorphology = "normal morphology";
    } else if( morphology == "large"){
      plateletMorphology = "large platelets observed";
    } else if (morphology == "giant"){
      plateletMorphology = "giant platelets observed";
    }
    
    //Platelet count
    var plateletCount = "";
    if( EHRdata.Platelets.lowOrHigh == "normal"){
      plateletCount = "Platelets are normal in number ";
    } else if( EHRdata.Platelets.lowOrHigh == "low"){
      plateletCount = "Thrombocytopenia ";
    } else if (EHRdata.Platelets.lowOrHigh == "high"){
      plateletCount = "Thrombocytosis ";
    }
    
    var lineOut = plateletCount + "with " + plateletMorphology + ". ";
    return lineOut;
  }
  
  thankYou = "\r\n\r\nThank you for this consultation. Please contact the lab at x2931 should any additional questions arise.";
  
  get objective(){
    return this.history + this.consult;
  }
  get smear(){
    var lineOut = "SMEAR MORPHOLOGY: ";
    lineOut += this.rbc;
    if(this.boolSchistocyte){ lineOut += "No significant increase in schistocytes or microspherocytes. Thus, no smear evidence of hemolysis. ";}      
    lineOut += this.cytopenias;
    lineOut += this.platelet;
    lineOut += "\r\n\r\n";
    return lineOut;
  }
  get impression(){
    var lineOut = "SMEAR IMPRESSION: ";    
    if(EHRdata.hemoglobin.isLow){
      if(EHRdata.MCV.isLow){
        lineOut += this.microcyticInterp;
      } else if (EHRdata.MCV.isNormal ){
        lineOut += this.normocyticInterp;
      }
      
      if(this.boolRpi){
        lineOut += this.rpiInterp;
      }
    } else if(EHRdata.hemoglobin.isHigh){
      
    }
    
    if(EHRdata.Platelets.isLow && this.boolIpf){
      if(!(EHRdata.immaturePlateletFraction.result === null)){
        if(EHRdata.immaturePlateletFraction.isHigh){
          lineOut += "The immature platelet fraction is appropriately elevated given the patient's thrombocytopenia, suggesting a destructive/consumptive process. "
        } else {
          lineOut += "The immature platelet fraction is not elevated, even though the patient has thrombocytopenia. This suggests a deficit in platelet production. "
        }
      } else if(EHRdata.Platelets.isLow && EHRdata.Platelets.result > 100){ //not ipf, ration
        lineOut += "An immature platelet fraction, which can help to differentiate platelet consumption vs. decreased production, will occur if the platelet count drops to 100 K/cmm or lower. ";    
      } else { //no ipf, irrational
        lineOut += "It is unclear why an immature platelet fraction was not performed as the platelet count is <=100 K/cmm. ";    
      }
    } else if(EHRdata.Platelets.isHigh){
      lineOut += "Thrombocytosis can result from a reactive or myeloproliferative neoplasms (MPN). ";
      lineOut += "Common reactive causes include inflammation (e.g., infection, rheumatological condition, malignancy), iron deficiency, and post-splenectomy. ";    
      lineOut += "MPNs most commonly have mutations in JAK2, CALR, or MPL (e.g., essential thrombocythemia, polycythemia vera, primary myelofibrosis). ";
    }
    
    if(this.boolrequestRetics){
      lineOut += "Ordering reticulocyte studies is likely to help investigate the anemia. ";
    }    
    if(this.boolflowCytometry){
      lineOut += "Flow cytometry is recommended for more specific cellular characterization. ";
    }
    lineOut += this.thankYou;
    return lineOut;
  }
  
  get interp(){
    return this.objective + this.smear + this.impression;
  }
};
var phrase = new Phrase();

function LabFormatResult(result, refLow, refHigh, id){
  if( result === null){
    return;
  }
  if(id == "urineBlood"){
    if(result != "NEG"){
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2191");
      $('#' + id).addClass('table-danger');
    }
    return;
  }
  if(refLow !== null){	  
    if( result < refLow ){
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2193")
      $('#' + id).addClass('table-danger');
    }
  }
  if(refHigh !== null){
    if( result > refHigh ){
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2191")
      $('#' + id).addClass('table-danger');
    }	  
  }
}

function resetFieldAccess(){
  if (EHRdata.Platelets.isNormal) {
    $('#ipf').prop('disabled', true)
  } else {
    $('#ipf').prop('disabled', false)
  }
  
  if (EHRdata.hemoglobin.isNormal) {
    $('#requestRetics').prop('disabled', true)
    $('#rpi').prop('disabled', true)
  } else {
    $('#requestRetics').prop('disabled', false)
    $('#rpi').prop('disabled', false)
  }
  
  if (EHRdata.ReticulocytesPct.result === null) {
    $('#rpi').prop('disabled', true)
  } else {
    $('#rpi').prop('disabled', false)
  }
}


$(document).ready(function(){
  //load
  //span text 
  $('#patientName').text(EHRdata.patientName);
  $('#last4').text(EHRdata.last4);
  //form input
  $('#age').val(EHRdata.age);
  $('#reasonForConsult').val(EHRdata.reasonForConsult);
  //form radio button
  if(EHRdata.gender = "male"){
    $("#sexMale").prop("checked", true);
  } else {
    $("#sexFemale").prop("checked", true);
  }  
  
  
  
  //set input with result
  for (const property in EHRdata) {
    if(typeof EHRdata[property] == "object" && EHRdata[property].constructor.name == "Lab"){
      $('#' + EHRdata[property].name + ' .result').html(EHRdata[property].resultNoUnit);
      $('#' + EHRdata[property].name + ' .unit').html(EHRdata[property].resultUnit);
      $('#' + EHRdata[property].name + ' .ref').html(EHRdata[property].refRange);
      $('#' + EHRdata[property].name + ' .specDate').html(EHRdata[property].complete);
      LabFormatResult(EHRdata[property].result, EHRdata[property].refLow, EHRdata[property].refHigh, EHRdata[property].name);
    }
  }  
  
  //age validation
  if( $('#age').val() == '' )
  $('#age').css("background-color", "pink");
  $('#age').on('input', function() {
    if( Math.floor(this.value) == this.value && $.isNumeric(this.value) ){
      $(this).css("background-color", "white");
      EHRdata.age = this.value;
    } else {
      $(this).css("background-color", "pink");
    }
  });
  
  //sex validation
  if( $('input[name=sexRadio]:checked', '#sex').val() == undefined ){
    $('#sex').css("background-color", "pink");
  }
  $('input[type=radio][name=sexRadio]').change(function() {
    $('#sex').css("background-color", "white");
    
    $('input[name=sexRadio]:checked', '#sex').each(function() {
      EHRdata.sex = this.nextElementSibling.textContent.toLowerCase();
    });
  });
  
  //reason for consult
  if( $('#reasonForConsult').val() == '' )
  $('#reasonForConsult').css("background-color", "pink");
  $('#reasonForConsult').on('input', function() {
    if( this.value != "" ){
      $(this).css("background-color", "white");
      EHRdata.reasonForConsult = this.value;
    } else {
      $(this).css("background-color", "pink");
    }
  });
  
  // Set limits on clinical phrases based on applicability
  resetFieldAccess()
  
  
  //Clinical phrases
  $('#noSchistocytes').click(function(){
    phrase.boolSchistocyte = !phrase.boolSchistocyte;
  });
  $('#flowCytometry').click(function(){
    phrase.boolflowCytometry = !phrase.boolflowCytometry;
  });
  $('#ipf').click(function(){
    phrase.boolIpf = !phrase.boolIpf;
  });
  $('#rpi').click(function(){
    phrase.boolRpi = !phrase.boolRpi;
  });    
  $('#requestRetics').click(function(){
    phrase.boolrequestRetics = !phrase.boolrequestRetics;
  });
  
  //keyboards
  $("#interp").keydown(function(event) {
    if(event.which == 113) {
        cur_text = $("#interp").val();
        start = cur_text.search(/\*\*\*/);
        if (start>0) {
          const textarea_el = document.getElementById('interp');
          textarea_el.setSelectionRange(start, start + 3);
        }
        return false;
    }
  });

  //check boxes
  // if(EHRdata.Platelets.isLow){
  //   $('#ipf').click();
  // }
  
  //refresh interpretation  
  $('#refreshInterp').click(function(){
    $('#interp').val(phrase.interp);
  })
  
  // reinitialize from current edited table data - DEV only
  $('#reInitialize').click(function(){
    console.log('made it')
    // transfer the current table data to EHRdata and reformat
    for (const property in EHRdata) {
      if(typeof EHRdata[property] == "object" && EHRdata[property].constructor.name == "Lab"){
        val_name = EHRdata[property].name
        new_val = $('#' + EHRdata[property].name + ' .result').html();
        if(val_name!="urineBlood"){
          new_val = Number(new_val)
        }
        val_type = typeof(new_val);
        //console.log({val_name,new_val,val_type});
        EHRdata[property].result = new_val
        
        $('#' + EHRdata[property].name + ' .unit').html(EHRdata[property].resultUnit);
        
        $('#' + EHRdata[property].name).removeClass('table-danger')
        LabFormatResult(EHRdata[property].result, EHRdata[property].refLow, EHRdata[property].refHigh, EHRdata[property].name);
      }
    }
    resetFieldAccess()
    $('#interp').val(phrase.interp);
  })
  

  // after setting up, initialze the interpretation
  $('#refreshInterp').click();

});
