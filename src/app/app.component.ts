import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TradeLayer';
  
  buyBook: Array<any> = [];
  sellBook: Array<any> = [];
  
  public quantity:string = "";
  public price:string = "";
  
  constructor(private http: HttpClient){
    this.initializeWebSocketConnection();
	this.initAction()
  }
  
  initializeWebSocketConnection(){
	
		
    var ws = new WebSocket('ws://104.251.213.18:40510');
	let that = this;
    ws.onopen = function () {
        console.log('websocket is connected ...')
        ws.send('connected')
    }
    ws.onmessage = function (ev) {
	    //var message = ev.data.split("<<<");
	    //var action = message[0].split("-");
		
		that.buyBook = [];
		that.sellBook = [];
		
		var booksObj = JSON.parse(ev.data)
		
		var buyBook = JSON.parse(booksObj[0])
		var buyMap:Map<any, any> = new Map();
		for(var i = 0; i < buyBook.length; i++) {
			buyMap.set(buyBook[i].effectiveprice, 0);
		}
		
		var sellBook = JSON.parse(booksObj[1])
		var sellMap:Map<any, any> = new Map();
		for(var i = 0; i < sellBook.length; i++) {
			sellMap.set(sellBook[i].effectiveprice, 0);
		}
		
		for(var i = 0; i < buyBook.length; i++) {
			let price = Number(buyMap.get(buyBook[i].effectiveprice));
			let addPrice = Number(buyBook[i].amountforsale);
			let newPrice = price + addPrice;
			buyMap.set(buyBook[i].effectiveprice, newPrice);
		}
		
		for(var i = 0; i < sellBook.length; i++) {
			let price = Number(sellMap.get(sellBook[i].effectiveprice));
			let addPrice = Number(sellBook[i].amountforsale);
			let newPrice = price + addPrice;
			sellMap.set(sellBook[i].effectiveprice, newPrice);
		}
		

 		buyMap.forEach(function(value,key) {

			var book = {
				price: '',
				quantity: ''
			};
			
			book.price = key;
			book.quantity = value;
			
			that.buyBook.push(book);
		});
		
		sellMap.forEach(function(value,key) {

			var book = {
				price: '',
				quantity: ''
			};
			
			book.price = key;
			book.quantity = value;
			
			that.sellBook.push(book);
		});
		
		
		
		
    }
	
  }	  

  
  buyAction(): void {

	this.http.post('http://104.251.213.18:8080/endpoint', {
      qty: this.quantity,
      price: this.price,
      action: 1
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
	  
  }
  
    sellAction(): void {

	this.http.post('http://104.251.213.18:8080/endpoint', {
      qty: this.quantity,
      price: this.price,
      action: 2
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
	  
  }
  
  
    initAction(): void {
		this.buyBook = [];
		this.sellBook = [];
	
	this.http.get('http://104.251.213.18:8080/init')
      .subscribe(
        res => {
			
		var buyBook = JSON.parse(res[0])
		var buyMap:Map<any, any> = new Map();
		for(var i = 0; i < buyBook.length; i++) {
			buyMap.set(buyBook[i].effectiveprice, 0);
		}
		
		var sellBook = JSON.parse(res[1])
		var sellMap:Map<any, any> = new Map();
		for(var i = 0; i < sellBook.length; i++) {
			sellMap.set(sellBook[i].effectiveprice, 0);
		}
		
		for(var i = 0; i < buyBook.length; i++) {
			let price = Number(buyMap.get(buyBook[i].effectiveprice));
			let addPrice = Number(buyBook[i].amountforsale);
			let newPrice = price + addPrice;
			buyMap.set(buyBook[i].effectiveprice, newPrice);
		}
		
		for(var i = 0; i < sellBook.length; i++) {
			let price = Number(sellMap.get(sellBook[i].effectiveprice));
			let addPrice = Number(sellBook[i].amountforsale);
			let newPrice = price + addPrice;
			sellMap.set(sellBook[i].effectiveprice, newPrice);
		}
		
		let that = this;
 		buyMap.forEach(function(value,key) {

			var book = {
				price: '',
				quantity: ''
			};
			
			book.price = key;
			book.quantity = value;
			
			that.buyBook.push(book);
		});
		

		sellMap.forEach(function(value,key) {

			var book = {
				price: '',
				quantity: ''
			};
			
			book.price = key;
			book.quantity = value;
			
			that.sellBook.push(book);
			
		});

		

		
		var sellBook = JSON.parse(res[1])
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
	  
  }
  
}
