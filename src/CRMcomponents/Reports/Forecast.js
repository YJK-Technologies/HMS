import { useState, useRef  } from 'react';
import LeadModal from './modal';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useNavigate } from "react-router-dom";

const getCurrentMonthName = () => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[new Date().getMonth()];
};

const getInitialColumns = () => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthIndex = new Date().getMonth();
  const columns = {};

  for (let i = 0; i < 4; i++) {
    const monthIndex = (currentMonthIndex + i) % 12;
    const monthName = monthNames[monthIndex];
    columns[monthName.toLowerCase()] = {
      name: monthName,
      items: []
    };
  }

  return columns;
};

const initialData = {
  columns: getInitialColumns()
};


export default function CRMBoard() {
  const [data, setData] = useState(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState('');



  const startAddLead = (columnId) => {
    setAddingToColumn(columnId);
    setSelectedColumnId('');
  };

  const cancelAddLead = () => {
    setAddingToColumn('');
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(sourceCol.items);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      setData((prev) => ({
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceCol,
            items
          }
        }
      }));
    } else {
      const sourceItems = Array.from(sourceCol.items);
      const destItems = Array.from(destCol.items);

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setData((prev) => ({
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceCol,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destCol,
            items: destItems
          }
        }
      }));
    }
  };

  const openModal = (columnId, lead = null) => {
    setSelectedColumnId(columnId);
    setEditingLead(lead);
    setModalShow(true);
    setAddingToColumn('');
  };

  const handleSaveLead = (newLead) => {
    const colId = selectedColumnId || addingToColumn;
    const col = data.columns[colId];

    const updatedItems = editingLead
      ? col.items.map((item) => (item.id === newLead.id ? newLead : item))
      : [...col.items, newLead];

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          ...col,
          items: updatedItems
        }
      }
    }));

    setModalShow(false);
    setEditingLead(null);
    setAddingToColumn('');
  };

  const handleDeleteLead = (columnId, leadId) => {
  const col = data.columns[columnId];
  const updatedItems = col.items.filter((item) => item.id !== leadId);

  setData((prev) => ({
    ...prev,
    columns: {
      ...prev.columns,
      [columnId]: {
        ...col,
        items: updatedItems
      }
    }
  }));
};
  const navigate = useNavigate();
const columnRefs = useRef({});
const [highlightedColumn, setHighlightedColumn] = useState(null);


 const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
   const handleNavigate1 = () => {
    navigate("/RChart"); // Pass selectedRows as props to the Input component
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
    navigate("/Forcast"); // Pass selectedRows as props to the Input component
  };

   const handleNavigate6 = () => {
    navigate("/Rpivot"); // Pass selectedRows as props to the Input component
  };
  
const addNewMonthColumn = () => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const existingMonths = Object.values(data.columns).map(col => col.name);
  const baseMonthIndex = new Date().getMonth();

  for (let i = 1; i <= 12; i++) {
    const nextMonthIndex = (baseMonthIndex + i) % 12;
    const monthName = monthNames[nextMonthIndex];
    const lowerCaseKey = monthName.toLowerCase();

    if (!existingMonths.includes(monthName)) {
      setData(prev => {
        const updated = {
          ...prev,
          columns: {
            ...prev.columns,
            [lowerCaseKey]: {
              name: monthName,
              items: []
            }
          }
        };

        // Timeout lets React render before scrolling
      setTimeout(() => {
  columnRefs.current[lowerCaseKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, 100);


        return updated;
      });

      break;
    }
  }
};
const handleDeleteColumn = (columnId) => {
  const confirmed = window.confirm("Are you sure you want to delete this month column?");
  if (!confirmed) return;

  setData((prev) => {
    const newColumns = { ...prev.columns };
    delete newColumns[columnId];
    return {
      ...prev,
      columns: newColumns
    };
  });

  // ✅ Fix this line
  delete columnRefs.current[columnId];
};



  return (
    <>
      <div className="container-fluid Topnav-screen">
        <div className="shadow-lg p-0 mb-2 bg-white rounded">
          <div className="d-flex justify-content-between flex-wrap p-1">
            <div className="d-flex justify-content-start">
              <h1 className=""> Forecast</h1>
            </div>
            <div className="d-flex justify-content-end">
              <addbutton className="mt-2 " onClick={handleNavigateKanban}>
                <i class="bi bi-kanban text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate}>
                <i class="bi bi-card-list text-dark fs-4"></i>
              </addbutton>

              <addbutton className="mt-2 " onClick={handleNavigate1}>
                <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
              </addbutton>

              <addbutton className="mt-2 me-2" onClick={addNewMonthColumn}>
                <i class="bi bi-plus-square text-success fs-4"></i>
              </addbutton>
              <addbutton className=" pt-3" onClick={() => handleDeleteColumn()}>
                <i className="bi bi-trash fs-4 text-danger"></i>
              </addbutton>

              <addbutton className="mt-2 " onClick={handleNavigate6}>
                <i class="bi bi-table text-success fs-4"></i>
              </addbutton>
            </div>
          </div>
        </div>

        <div
          className="shadow-lg p-3 bg-white rounded crm-column-wrapper"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="d-flex justify-content-between flex-wrap p-1">
              {Object.entries(data.columns).map(([id, column]) => (
                <div
                  key={id}
                  ref={(el) => {
                    if (el) columnRefs.current[id] = el;
                  }}
                  onMouseDown={() => {
                    // Start long-press timer
                    columnRefs.current.longPressTimeout = setTimeout(() => {
                      setHighlightedColumn(id);
                    }, 2000); // 2 seconds
                  }}
                  onMouseUp={() => {
                    clearTimeout(columnRefs.current.longPressTimeout);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(columnRefs.current.longPressTimeout);
                  }}
                  style={{
                    flex: "0 0 300px",
                    marginRight: "16px",
                    backgroundColor:
                      highlightedColumn === id ? "#fff3cd" : "transparent",
                    border:
                      highlightedColumn === id ? "2px solid #ffc107" : "none",
                    borderRadius: "8px",
                    transition: "background-color 0.3s, border 0.3s",
                  }}
                >
                  <Column
                    droppableId={id}
                    column={column}
                    onAddLead={() => startAddLead(id)}
                    isAdding={addingToColumn === id}
                    onCancelAddLead={cancelAddLead}
                    onSubmitAddLead={handleSaveLead}
                    onEditLead={(lead) => openModal(id, lead)}
                    onDeleteLead={(leadId) => handleDeleteLead(id, leadId)}
                    onDeleteColumn={() => handleDeleteColumn(id)}
                    highlightedColumn={highlightedColumn}
                  />
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Modal for editing leads */}
      {modalShow && (
        <LeadModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setEditingLead(null);
          }}
          initialData={editingLead}
          onSubmit={handleSaveLead}
        />
      )}
    </>
  );
}
