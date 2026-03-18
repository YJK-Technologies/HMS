import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./CRMLocation.css"; // your custom styles if any
import { useNavigate } from "react-router-dom";

// Dummy customer data
const customers = [
  { name: "Harish - T. Nagar", lat: 13.0418, lng: 80.2337, revenue: 120000 },
  { name: "Pavun - Velachery", lat: 12.9784, lng: 80.2218, revenue: 45000 },
  { name: "Rajan - Anna Nagar", lat: 13.0878, lng: 80.2106, revenue: 8000 },
];

// Helper function for marker color based on revenue
function getMarkerColor(revenue) {
  if (revenue > 100000) return "green";
  if (revenue > 30000) return "orange";
  return "red";
}

export default function CustomerMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (map.current) return;

  map.current = new maplibregl.Map({
    container: mapContainer.current,
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
    center: [80.2707, 13.0827],
    zoom: 11,
  });

  const popup = new maplibregl.Popup({ offset: 25 });

  customers.forEach((customer) => {
    const el = document.createElement("div");
    el.style.backgroundColor = getMarkerColor(customer.revenue);
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.borderRadius = "50%";
    el.style.cursor = "pointer";
    el.style.border = "2px solid white";

    const marker = new maplibregl.Marker(el)
      .setLngLat([customer.lng, customer.lat])
      .addTo(map.current);

    marker.getElement().addEventListener("click", () => {
      popup
        .setLngLat([customer.lng, customer.lat])
        .setHTML(`<strong>${customer.name}</strong>`)
        .addTo(map.current);

      setSelectedCustomer(customer);
    });
  });

  return () => map.current?.remove();
}, []);
  const navigate = useNavigate();

 const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
   const handleNavigate1 = () => {
    navigate("/CrmChart"); // Pass selectedRows as props to the Input component
  };

     const handleNavigate3 = () => {
    navigate("/CrmScheduler"); // Pass selectedRows as props to the Input component
  };

     const handleNavigate4 = () => {
    navigate("/CrmActivity"); // Pass selectedRows as props to the Input component
  };
    const handleNavigate5 = () => {
    navigate("/CrmLocation"); // Pass selectedRows as props to the Input component
  };

  const handleNavigateKanban = () => {
    navigate("/Crmworkspace"); // Pass selectedRows as props to the Input component
  };
  
  
  return (
    <>
      <div className="Topnav-screen container-fluid ">
        <div className="d-flex justify-content-between shadow-lg rounded-3 bg-white flex-wrap p-1 mb-2">
          <div className="d-flex justify-content-start">
            <h1 className="">CRM Location</h1>
          </div>
          <div className="d-flex justify-content-end">
             <addbutton className="mt-2 " onClick={handleNavigateKanban}>
              <i class="bi bi-kanban text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate}>
              <i class="bi bi-card-list text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate3}>
              <i class="bi bi-calendar3 text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate1}>
              <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate4}>
              <i class="bi bi-stopwatch text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate5}>
              <i class="bi bi-geo-alt-fill text-dark fs-4"></i>
            </addbutton>
          </div>
        </div>
        <div></div>
        <div
          className="d-flex  shadow-lg bg-white"
          style={{ height: "90vh", width: "100%" }}
        >
          {/* Map container */}
          <div
            ref={mapContainer}
            style={{ flex: 2, height: "860px", minWidth: 0 }}
          />

          {/* Side Panel */}
          <div
            style={{ flex: 1 }}
            className="p-3 border-start bg-white shadow-sm d-flex flex-column"
          >
            <h5 className="mb-4">Customer Details</h5>

            {loading && (
              <div
                className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
                style={{ minHeight: "150px" }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-3">Loading customer data...</p>
              </div>
            )}

            {!loading && selectedCustomer && (
              <div>
                <h6>{selectedCustomer.name}</h6>
                {/* <p>
              Lat: {selectedCustomer.lat}, Lng: {selectedCustomer.lng}
            </p> */}
                <p>Revenue: ₹{selectedCustomer.revenue.toLocaleString()}</p>

                <div className="progress mt-3" style={{ height: "25px" }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        selectedCustomer.revenue / 2000,
                        100
                      )}%`,
                    }}
                  >
                    {Math.min(
                      (selectedCustomer.revenue / 2000).toFixed(0),
                      100
                    )}
                    %
                  </div>
                </div>
              </div>
            )}

            {!loading && !selectedCustomer && (
              <p className="text-muted">
                Click a marker to view customer data.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
