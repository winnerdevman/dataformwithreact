import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import { FormControl, FormLabel, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import FormSelect from "react-bootstrap/FormSelect";

import "./App.css";
import { COUNTRIES_DATA } from "./countries";
import { AVAILABLE_SERVICES } from "./services";
import { getBalance, getNumber, getServices, getStatus, sendStatus } from "./services/api";

function App() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [availableServices, setAvailableServices] = useState(null);
  const [activationId, setActivationId] = useState();
  const [balance, setBalance] = useState();

  // 918208066190
  // 456677668
  useEffect(() => {
    console.log(selectedCountry, selectedService, phoneNumber);
  });

  useEffect(() => {
    async function fetchServices() {
      let data = await getServices(selectedCountry);
      if (data) {
        // setAvailableServices(Object.keys(data[selectedCountry]));
        let svs = Object.keys(data[selectedCountry])
        setAvailableServices(svs.filter(f => f == 'pf'));
      }
    }
    fetchServices();
  }, [selectedCountry]);

  const getNumberClicked = async () => {
     const response = await getNumber(selectedCountry, selectedService)
     try {
      const parsed = response.split(':')
      setActivationId(parsed[1])
      setPhoneNumber(parsed[2] || '')
     } catch(error) {
      console.log("Error getting number ==> ", error)
     }
  }

  const getBalanceClicked = async () => {
    // ACCESS_BALANCE:BALANCE
    try {
      const response = await getBalance();
      const parsed = response.split(':')
      setBalance( !isNaN(parsed[1])  ? parsed[1] : '')
    } catch(error) {
      console.log("Error getting balance ==> ", error)
     }
  }

  const sendVerificationCodeClicked = async () => {
    try {
      await sendStatus(1, activationId);
      const response =await getStatus(activationId)
      console.log(response);
      if(response.indexOf(':') != -1) {
        setVerificationCode(response.split(':')[1])
      } else {
        setVerificationCode(response)
      }
    } catch (error) {
      console.log("Error sending verification code ==> ", error)
    }
  }

  const getAnotherClicked = async () => {
    try {
      await sendStatus(3, activationId);
      const response =await getStatus(activationId)
      setVerificationCode(response)
    } catch (error) {
      console.log("Error sending verification code ==> ", error)
    }
  }

  const cancelClicked = async () => {
    try {
      await sendStatus(8, activationId);
      reset()
    } catch (error) {
      console.log("Error canceling verification code ==> ", error)
    }
  }
  const doneClicked = async () => {
    try {
      const response = await sendStatus(6, activationId);
      if(response == "ACCESS_ACTIVATION") reset()
    } catch (error) {
      console.log("Error canceling verification code ==> ", error)
    }
  }

  const reset = () => {
    setSelectedCountry('')
    setSelectedService('')
    setPhoneNumber('')
    setVerificationCode('')
    setActivationId(undefined)
    setVerificationCode('')
  }

  return (
    <>
      <div className="container">
        <FormLabel htmlFor="country-selector">Country:</FormLabel>
        <FormSelect
          id="country-selector"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option>Select a country</option>
          {COUNTRIES_DATA.filter((country) => country.name == "india").map((country) => (
            <option value={country.id} key={country.id}>
              {country.name.slice(0, 1).toLocaleUpperCase() +
                country.name.slice(1)}
            </option>
          ))}
        </FormSelect>
        <br />
        <FormLabel htmlFor="service-selector">Service:</FormLabel>
        <FormSelect
          id="service-selector"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option>Select a Service</option>
          {availableServices?.map((serviceId) => (
            <option value={serviceId} key={serviceId}>
              {AVAILABLE_SERVICES[serviceId]}
            </option>
          ))}
        </FormSelect>
        <br />
        <Row>

        </Row>
        <div>
          <Button
            onClick={getNumberClicked}
            variant="primary"
            disabled={!selectedCountry && !selectedService}
          >
            Get Number
          </Button>
          <Button
            onClick={getBalanceClicked}
            variant="primary"
            style={{marginLeft: '10px', marginRight: '10px'}}
          >
            Get Balance
          </Button>
            Balance: {balance}
        </div>
        <br />
        <br />
        <FormLabel htmlFor="phone-number">Phone Number:</FormLabel>
        <FormControl
          type="phoneNumber"
          id="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled
        />
        <br />
        <Button variant="primary" disabled={phoneNumber.length < 10} onClick={sendVerificationCodeClicked}>
          Send Verification Code
        </Button>
        <br />
        <br />
        <FormLabel htmlFor="verification-code">Verification Code:</FormLabel>
        <FormControl
          type="default"
          id="verification-code"
          value={verificationCode}
          disabled
          onChange={(e) => setVerificationCode(e.target.value)}
        />

        <br />
        <div>
          <Button style={{marginRight: '10px'}} variant="primary" disabled={isNaN(verificationCode) || !verificationCode} onClick={doneClicked}>
            Done
          </Button>
          <Button style={{marginRight: '10px'}} variant="primary" disabled={phoneNumber.length < 10} onClick={getAnotherClicked}>
            Get Another Code
          </Button>
          <Button style={{marginRight: '10px'}} variant="primary" disabled={phoneNumber.length < 10} onClick={cancelClicked} >
            Cancel Verification
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
