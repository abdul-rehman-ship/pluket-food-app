import React from 'react'
import style from '../styles/vendor.module.css'

import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Offcanvas from 'react-bootstrap/Offcanvas';






export default function VendorNavbar() {
 

  

 
  return (
    <>
     <Navbar   expand={'lg'} className={`mb-3   shadow-sm ${style.navbarContainer}`} style={{padding:"1rem"}}>
          <Container >
            <Navbar.Brand style={{color:"#8A2BE2FF !important",fontWeight:600}}>Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
           {Navbar ?  <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{color:"#8A2BE2FF !important",fontWeight:600}} id={`offcanvasNavbarLabel-expand-lg`}>
                  Admin Dashboard
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link  href="/adminDashboard" className={`mx-3 ${style.menu} `} style={{fontWeight:600}}>Home</Nav.Link>

                <Nav.Link  href="/adminCategories" className={`mx-3 ${style.menu} `} style={{fontWeight:600}}>Categories</Nav.Link>
                <Nav.Link  href="/adminPromotions" className={`mx-3 ${style.menu} `} style={{fontWeight:600}}>Promotions</Nav.Link>
                 
                  <Nav.Link href="/adminOrders" className={`mx-3 ${style.menu} `} style={{fontWeight:600}} >Kitchen</Nav.Link>
                  <Nav.Link href="/adminAllStats" className={`mx-3 ${style.menu} `} style={{fontWeight:600}} >Stats</Nav.Link>

                  <Nav.Link href="/adminDelivery" className={`mx-3 ${style.menu} `} style={{fontWeight:600}} >Delivery</Nav.Link>
                  <Nav.Link href="/adminDelivered" className={`mx-3 ${style.menu} `} style={{fontWeight:600}} >Delivered</Nav.Link>
                  
                  <NavDropdown
            title="More"
            id="basic-nav-dropdown"
            className={`mx-3 ${style.menu}`}
            style={{ fontWeight: 600,color:"#000000BC !important" }}
          >
                  
                  <NavDropdown.Item  href="/adminStats" className={`mx-3 ${style.menu} `} style={{fontWeight:600,color:"#000000BC !important",fontFamily:'Poppins !important'}} >Referrer Stats</NavDropdown.Item>

            <NavDropdown.Item  className={`mx-3 ${style.menu} `}  style={{fontWeight:600}} href="/adminOpenHours">Timing</NavDropdown.Item>
            <NavDropdown.Item  className={`mx-3 ${style.menu} `}  style={{fontWeight:600}} href="/adminRequests">Referrer Requests</NavDropdown.Item>
            <NavDropdown.Item  className={`mx-3 ${style.menu} `}  style={{fontWeight:600}} href="/adminUndeliverable">Un deliverable</NavDropdown.Item>

           
          </NavDropdown>
                  <Nav.Link href="/" className={`mx-3 ${style.menu} `} style={{fontWeight:600}} >Log out</Nav.Link>

                  
                  





                  
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>:'loading...'}
          </Container>
        </Navbar>
    
    
    </>
  )
}
