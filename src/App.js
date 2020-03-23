import React, { Component } from 'react';
import cheerio from 'cheerio';
import './App.css';


class App extends Component{


  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.getData = this.getData.bind(this);
    this.getHouses = this.getHouses.bind(this);
    this.getBt6houses = this.getBt6houses.bind(this);

    this.state = {
      lat: 0,
      long: 0,
      postCode: "",
      houses: [],
      bt6Houses: [],
    }

    this.demo = React.createRef();
    this.postcodeHTML = React.createRef();
    this.houses = React.createRef();
    this.BT6 = React.createRef();
  }

  getData() {
    var xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
      var postCodeObj = JSON.parse(xhr.responseText);
      var postCode = postCodeObj.result[0].postcode;
      this.setState({ postCode: postCode});
      console.log(this.state.postCode);
      this.postcodeHTML.innerHTML = "Your post code is: " + this.state.postCode;

    })
    
    xhr.open('GET', 'https://api.postcodes.io/postcodes?lon='+this.state.long+'&lat='+this.state.lat)
    xhr.send()    
    
  }

  getHouses() {
    fetch('https://cors-anywhere.herokuapp.com/https://www.propertypal.com/search?sta=forSale&st=sale&runit=m&rlat='+this.state.lat+'&rlng='+this.state.long+'&pt=residential&nl=My+Location')
    .then(response => response.text())
        .then((response) => {
          console.log(response);
          const $ = cheerio.load(response); 

          var names = $('.propbox-addr').text().split(',');

          this.setState({ houses: names})

          this.houses.innerHTML = this.state.houses
      
        })
        .catch(err => console.log(err))

  }

  getBt6houses(){
    fetch('https://cors-anywhere.herokuapp.com/https://www.propertypal.com/property-for-sale/bt6')
    .then(response => response.text())
        .then((response) => {
          console.log(response);
          const $ = cheerio.load(response); 

          var names = $('.propbox-addr').text().split(',');

          this.setState({ bt6Houses: names})

          this.BT6.innerHTML = this.state.bt6Houses
      
        })
        .catch(err => console.log(err))
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success, this.error, this.options)
    } else {
      this.demo.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  success(pos) {
    var crd = pos.coords;

    this.setState({lat: crd.latitude});
    this.setState({long: crd.longitude});

    this.demo.innerHTML = "Thanks!! Your position is: <br>" + "Latitude: " + crd.latitude + 
    "<br>Longitude: " + crd.longitude; 
  }

  error(err) {
    this.demo.innerHTML =`ERROR(${err.code}): ${err.message}`;
  }

  render(){
    return(
      <div>
        <p>Step 1: Click here to allow your location to be visible</p>
        <p>This gives the browser permission to view your location.</p>
        <button onClick={this.getLocation}>
            Click
        </button>
        <p ref={r=>this.demo = r}></p>

        <p>Step 2: Then click here to get your post code:</p>
        <p>Using the coordinates above, we call an api to return the post code they belong to.</p>
        <button onClick={this.getData}>
            Click
        </button>
        <p ref={r=>this.postcodeHTML = r}></p>

        <p>Step 3: Now click here to search Property Pal for houses in your area</p>
        <button onClick={this.getHouses}>
            Click
        </button>
        <p ref={r=>this.houses = r}></p>

        <p>Step 4: Now search for properties with the post code BT6: </p>
        <button onClick={this.getBt6houses}>
            Click
        </button>
        <p ref={r=>this.BT6 = r}></p>
       
      </div>
    );
  }

}

export default App;
