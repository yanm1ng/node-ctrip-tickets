var request = require('request');
var iconv = require('iconv-lite');

var url = 'http://trains.ctrip.com/TrainBooking/Ajax/SearchListHandler.ashx?Action=getSearchList';

var postData = {
	"IsBus": false,
    "Filter": "0",
    "Catalog": "",
    "IsGaoTie": false,
    "IsDongChe": false,
    "CatalogName": "",
    "DepartureCity": "hangzhou",
    "ArrivalCity": "shanghai",
    "HubCity": "",
    "DepartureCityName": "杭州",
    "ArrivalCityName": "上海",
    "DepartureDate": "2017-01-25",
    "DepartureDateReturn": "",
    "ArrivalDate": "",
    "TrainNumber": ""
};

var options = {
    encoding: null,
    method: 'POST',
    url: url,
    form: {
        value: JSON.stringify(postData)
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded:charset=gb2312',
    }
};

function main() {
    console.log('\n 🚄  Search From:', new Date().toString());
    request.post(options, callback);
}

function callback(error, response, body) {
    var list = JSON.parse(iconv.decode(body, "gb2312")).TrainItemsList;
    console.log(list);
    
}

main();
