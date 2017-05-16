var request = require('request');
var iconv = require('iconv-lite');
var city = require('./city');

var url = 'http://trains.ctrip.com/TrainBooking/Ajax/SearchListHandler.ashx?Action=getSearchList';

var [, , departureCity, arrivalCity, date] = process.argv;
// 始发城市信息
var departureInfo = city.filter((item) => {
  return item.name === departureCity
})
// 终点城市信息
var arrivalInfo = city.filter((item) => {
  return item.name === arrivalCity
})

if (departureInfo.length === 0 || arrivalInfo.length === 0) {
  console.log('❌城市名称错误');
  process.exit()
}

var postData = {
  "IsBus": false,
  "Filter": "0",
  "Catalog": "",
  "IsGaoTie": false,
  "IsDongChe": false,
  "CatalogName": "",
  "DepartureCity": departureInfo[0].pinyin.toLowerCase(), //可修改
  "ArrivalCity": arrivalInfo[0].pinyin.toLowerCase(), //可修改
  "HubCity": "",
  "DepartureCityName": departureCity, //可修改
  "ArrivalCityName": arrivalCity, //可修改
  "DepartureDate": date,
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
  console.log('\n 🚄  Search From:', new Date().toString(), '\n');
  request.post(options, callback);
}

function callback(error, response, body) {
  var list = JSON.parse(iconv.decode(body, 'gb2312')).TrainItemsList;
  var newList = parseList(list);
  showList(newList);
}

function parseList(list) {
  var newList = [];

  for (var i = 0; i < list.length; i++) {
    var seats = list[i].SeatBookingItem;
    var remain = 0;
    for (var j = 0; j < seats.length; j++) {
      remain += seats[j].Inventory;
    }
    if (remain > 0) {
      newList.push(list[i]);
    }
  }
  return newList;
}

function strFormat(str, len, code = 'en') {
  var strLen = str.toString().length;
  for (var i = 0; i < (len - strLen); i++) {
    if (code == 'en') {
      str += ' ';
    } else {
      str += '  ';
    }
  }
  return str;
}

function showList(list) {
  if (list.length === 0) {
    console.log('查询失败/暂无列车信息❗️\n');
  } else {
    for (var i = 0; i < list.length; i++) {
      var TrainName = list[i].TrainName;
      var StartStationName = list[i].StartStationName;
      var EndStationName = list[i].EndStationName;
      var StratTime = list[i].StratTime;
      var EndTime = list[i].EndTime;
      var Seats = list[i].SeatBookingItem;
      var str = '';
      for (var j = 0; j < Seats.length; j++) {
        str += Seats[j].SeatName + ': ' + strFormat(Seats[j].Inventory, 3) + ' | ';
      }
      var train = '车次：' + strFormat(TrainName, 5) + ' 开始：' + strFormat(StartStationName, 5, 'ch') + ' 到达：' + strFormat(EndStationName, 5, 'ch') + ' 发出时间：' + StratTime + '   到达时间：' + EndTime + '   余票：' + str + '\n';
      console.log(train);
    }
  }
}

main();
