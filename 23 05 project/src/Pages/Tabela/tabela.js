import "./tabela.css";
import Navbar from ".././../components/Navbar";
import { EditarPopup } from "../EditarPopup";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function Lista({ users }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, sortBy]);

  function editUsers(item) {
    const tableLogin = item.login;
    const tableNome = item.nome;
    const tableSenha = item.senha;
    const tableEmail = item.email;
    const tableTipo = item.usuariotipo;
    const tableId = item.id;
    const tableData = {
      tableLogin: tableLogin,
      tableNome: tableNome,
      tableSenha: tableSenha,
      tableEmail: tableEmail,
      tableTipo: tableTipo,
      tableId: tableId,
    };
    console.log(tableData);
    localStorage.setItem("tableUser", JSON.stringify(tableData));
  }

  function modifyStatus(item) {
    fetch(`http://localhost:3001/usuarios/${item.login}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    window.location.reload(false);
  }

  function statusValida(item) {
    return item.status === "ativo" ? "success" : "danger";
  }

  const filteredUsers = users.filter((item) => {
    const searchValueLowerCase = searchValue.toLowerCase();
    return (
      item.login.toLowerCase().includes(searchValueLowerCase) ||
      item.email.toLowerCase().includes(searchValueLowerCase) ||
      item.status.toLowerCase().startsWith(searchValueLowerCase) ||
      item.datacadastro.toLowerCase().includes(searchValueLowerCase) ||
      item.usuariotipo.toLowerCase().startsWith(searchValueLowerCase)
    );
  });

  let sortedUsers = [...filteredUsers];

  switch (sortBy) {
    case "loginAlphabetical":
      sortedUsers.sort((a, b) => a.login.localeCompare(b.login));
      break;
    case "dateRecent":
      sortedUsers.sort((a, b) => {
        const dateA = convertDateStringToDate(a.datacadastro);
        const dateB = convertDateStringToDate(b.datacadastro);
        return dateB - dateA;
      });
      break;
    case "dateOldest":
      sortedUsers.sort((a, b) => {
        const dateA = convertDateStringToDate(a.datacadastro);
        const dateB = convertDateStringToDate(b.datacadastro);
        return dateA - dateB;
      });
      break;
    default:
      break;
  }

  function convertDateStringToDate(dateString) {
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  return (
    <>
      <Navbar />
      <div className="container3">
        <div className="titulo3">
          <div className="title-container3">
            <h1>Controle de usuários</h1>
            <hr className="title-hr3" />
          </div>
          <div />
        </div>

        <div className="fundo3">
          <div className="popupdiv">
            <ReactModal
              className="popup"
              isOpen={isOpen}
              onRequestClose={toggleModal}
            >
              <EditarPopup />
            </ReactModal>
          </div>
          <input
            className="pesquisa"
            type="text"
            placeholder="Pesquisar usuário"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <select
            aria-label="ordenação"
            className="cbx-filtro"
            id="obg5"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Ordenar por</option>
            <option value="loginAlphabetical">Ordem alfabética</option>
            <option value="dateRecent">Data de cadastro (mais recente)</option>
            <option value="dateOldest">Data de cadastro (mais antiga)</option>
          </select>

          <MDBTable align="middle">
            <MDBTableHead>
              <tr>
                <th scope="col" className="fw-bold mb-1">
                  ㅤLogin
                </th>
                <th scope="col" className="fw-bold mb-1">
                  ㅤㅤㅤCadastro
                </th>
                <th scope="col" className="fw-bold mb-1">
                  Status
                </th>
                <th scope="col" className="fw-bold mb-1">
                  ㅤTipo
                </th>
                <th scope="col" className="fw-bold mb-1">
                  ㅤㅤㅤAções
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {paginate(sortedUsers, currentPage, itemsPerPage).map(
                (item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="ms-3">
                          <p className="fw-normal mb-1">{item.login}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.datacadastro}</p>
                    </td>
                    <td>
                      <MDBBadge color={statusValida(item)} pill>
                        {item.status}
                      </MDBBadge>
                    </td>
                    <td>{item.usuariotipo}</td>
                    <td>
                      <MDBBtn
                        color="link"
                        rounded
                        size="sm"
                        onClick={() => {
                          toggleModal();
                          editUsers(item);
                        }}
                      >
                        ✏️
                      </MDBBtn>
                      <MDBBtn
                        color="link"
                        rounded
                        size="sm"
                        onClick={() => modifyStatus(item)}
                      >
                        {item.status === "ativo" ? "Desativar" : "Ativar"}
                      </MDBBtn>
                    </td>
                  </tr>
                )
              )}
            </MDBTableBody>
          </MDBTable>

          <MDBPagination className="pagination" circle center>
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">«</span>
              </MDBPaginationLink>
            </MDBPaginationItem>

            {Array.from({
              length: Math.ceil(sortedUsers.length / itemsPerPage),
            }).map((item, i) => (
              <MDBPaginationItem
                key={i}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                <MDBPaginationLink href="#">{i + 1}</MDBPaginationLink>
              </MDBPaginationItem>
            ))}

            <MDBPaginationItem
              disabled={currentPage === Math.ceil(sortedUsers.length / itemsPerPage)}
            >
              <MDBPaginationLink
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
          <div style={{ color: "white" }}>ㅤ</div>
        </div>
      </div>
    </>
  );
}

export default Lista;
