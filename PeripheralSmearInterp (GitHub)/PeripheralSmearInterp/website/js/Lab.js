class Lab {
  name = "";
  result = -1;
  unit = "";
  complete = "";
  refLow = "";
  refHigh = "";

  constructor(name, result, unit, complete, refLow, refHigh) {
    this.name = name;
    this.result = result;
    this.unit = unit;
    this.complete = complete;
	
	//Remove inequalities
    this.refLow = refLow;
    this.refHigh = refHigh;		
  }

  get resultWithUnit(){
    if( this.result === null){
      return "";
    }
    if( this.unit === null || this.result == 0){ //no units available or result is zero      
      return this.result
    } else if(this.unit == "%"){
      //no space if '%'
      return this.result + this.unit;  
    } else {
      return this.result + " " + this.unit;
    }    
  }

  get resultNoUnit(){
    if( this.result === null){
      return "";
    } else {
      return this.result;
    }    
  }

  get resultUnit(){
    if( this.unit === null){
      return "";
    } else {
      return this.unit;
    }    
  }

  get refRange(){
    if(this.refLow === null && this.refHigh === null){
      return "";
    } else if(this.refLow === null && this.refHigh !== null){
      return this.refHigh;
    } else if(this.refLow !== null && this.refHigh === null){
      return this.refLow;
    } else {
      return this.refLow + "-" + this.refHigh;
    }
  }

  get isLow(){
    if( this.result < this.refLow){
      return true;
    }
    return false;
  }
  get isHigh(){
    if( this.result > this.refHigh){
      return true;    
    }
    return false;
  }
  get isNormal(){
    if( this.result < this.refHigh && this.result > this.refLow){
      return true;
    }
    return false;
  }
  get lowOrHigh(){
    if( this.result > this.refHigh){
      return "high";    
    } else if( this.result < this.refLow){
      return "low";
    }
    else {return "normal";}
  }

}