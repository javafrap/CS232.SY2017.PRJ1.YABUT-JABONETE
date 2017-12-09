db.T1.mapReduce(
	function(){
		emit ({"Country": this.Region.Subregion.Country, "City": this.Region.Subregion.Country.City},{"Number_of_Months": 1, "Temperature_Sum":

this.Region.Subregion.Country.City.Temperature.AvgTemp});
	},
	function(key, values){
		mR1 = {"Number_of_Months": 0, "Temperature_Sum" : 0};
		values.forEach(function(value){
			mR1.Number_of_Months += value.Number_of_Months;
			mR1.Temperature_Sum += value.Temperature_Sum;
		});
		return mR1;
	},
	{
		"out": "T1_2",
		"finalize": function(key, newTemp) {
			newTemp.Avg_Temperature = newTemp.Temperature_Sum / newTemp.Number_of_Months;
			return newTemp;
		}
	})

	var mFunc = function (){
	emit ({"City": this._id.City, "Average_Temperature": this.value.average}, 1);}

	var rFunc = function(){return 0;}
	db.T1_2.mapReduce(mFunc,rFunc, {out:"T1_3"})
	db.T1_3.update({},{$unset:{value:1}},false,true);