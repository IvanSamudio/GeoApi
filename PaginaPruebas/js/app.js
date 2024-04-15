import { getFeatures } from "./api-fetch.js";
import { getFeaturesFilter } from "./api-fetch.js";
import { postComment } from "./api-fetch.js";


//OBTENCION POR DEFECTO DE FEATURES
const features = await getFeatures();
//VALOR SELECCIONADO EN EL FILTRO DE TIPO DE MAGNITUD
let selectedValue = "";

//LLAMA A LA FUNCION MAIN
window.onload(generateMain(features));

//Se encarga de generar el main de la pagina
//ESTA AGREGA LA GRAN PARTE DE LOS EVENT LISTENER DE LA PAGINA
function generateMain(features){
  let next = document.getElementById("nextPage");
  let previous = document.getElementById("previousPage");
  next.addEventListener("click", () => changePage(next.value));
  previous.addEventListener("click", () => changePage(previous.value));
  previous.disabled=true;
  document.getElementById("mag_type_filter").addEventListener('change', (event) => {
    selectedValue = event.target.value;
    // Ejecutar la función con el valor seleccionado
    if (selectedValue == "none"){
      generateTable(features);
    }else{
      filterFeatures();
    }
    
  });
  // Obtener el formulario y los campos necesarios por sus IDs
  const formComment = document.querySelector('.formComments');
  const commentInput = document.getElementById('comentario');
  const selectFeature = document.getElementById('featureComment');

  // Agregar evento submit al formulario
  formComment.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario por defecto
  
  // Obtener los valores del comentario y la feature seleccionada
    const comment = commentInput.value;
    const idFeature = selectFeature.value;
    postComment(idFeature,comment);
  });

  generateTable(features);
}

//GENERA LA TABLA DE FEATURES DINAMICAMENTE
function generateTable(features) {
  const tableBody = document.querySelector("#tableBody");
  // Limpiar el contenido actual de la tabla
  tableBody.innerHTML = "";

  // Iterar sobre cada objeto en el arreglo y agregar una fila a la tabla

  features["data"].forEach((feature) => {
    const row = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = feature.title;
    row.appendChild(tdTitle);

    const tdPlace = document.createElement("td");
    tdPlace.textContent = feature.place;
    row.appendChild(tdPlace);

    const tdTime = document.createElement("td");
    tdTime.textContent = feature.time;
    row.appendChild(tdTime);

    const tdLongitude = document.createElement("td");
    tdLongitude.textContent = feature.coordinates.longitude;
    row.appendChild(tdLongitude);

    const tdLatitude = document.createElement("td");
    tdLatitude.textContent = feature.coordinates.latitude;
    row.appendChild(tdLatitude);

    const tdMagnitude = document.createElement("td");
    tdMagnitude.textContent = feature.magnitude;
    row.appendChild(tdMagnitude);

    const tdTsunami = document.createElement("td");
    if(feature.tsunami){
      tdTsunami.textContent = "Tsunami";
    }else{
      tdTsunami.textContent = "No es tsunami";
    }
    row.appendChild(tdTsunami);

    const tdMag_type = document.createElement("td");
    tdMag_type.textContent = feature.mag_type;
    row.appendChild(tdMag_type);    

    tableBody.appendChild(row);
  });
  pagination(features.pagination);
  generateListFeaturesForComments(features["data"]);
}


//SE ENCARGA DE LA FUNCIONALIDAD DE PAGINACION
function pagination(pagination){
  const itemsContainer = document.querySelector("#items");
  itemsContainer.innerHTML = "";

  let previousPage = document.getElementById("previousPage");
  let nextPage =  document.getElementById("nextPage");

  //paginacion de los botones adelante atras
  if(pagination.current_page>1){
    previousPage.disabled = false;
    previousPage.value = pagination.current_page-1;
  }else{
    previousPage.disabled= true;
  }
  if(pagination.current_page >= pagination.total_pages){
    nextPage.disabled = true;
  }else{
    nextPage.disabled = false;
    nextPage.value = pagination.current_page+1;
  }
  
  //funcionalidad numeros para cambiar de pagina
  for (let i = pagination.current_page; i < pagination.current_page+5 && i <= pagination.total_pages; i++) {
    const item = document.createElement("li");
    item.classList.add("page-item");
    if (pagination.current_page === i) {
      item.classList.add("active");
    }

    const link = document.createElement("button");
    link.classList.add("page-link");
    link.textContent = i;
    link.addEventListener("click", () => changePage(i));

    item.appendChild(link);
    itemsContainer.appendChild(item);
  }
  
}

//cAMBIA DE PAGINA
async function changePage(numberPage) {
  try {
    let list = "";
    if(selectedValue == "none"){
       list = await getFeatures(numberPage);
    }else{
      list = await getFeaturesFilter(selectedValue,numberPage)
    }
    pagination(list.pagination);
    generateTable(list);
  } catch (error) {
    console.error("Error al cambiar de página:", error);
  }
}

//OBTIENE LAS FEATURES FILTRADAS
async function filterFeatures(page=1) {
  try {
    const list = await getFeaturesFilter(selectedValue,page);
    console.log(list);
    pagination(list.pagination);
    generateTable(list);
  } catch (error) {
    console.error("Error al obtener features:", error);
  }
}


//GENERA LAS OPCIONES DEL DROPDOWN DE COMENTARIOS
function generateListFeaturesForComments(features){
  let dropdownFeature = document.getElementById('featureComment');
  dropdownFeature.innerHTML = "";
    //Iterar sobre las features y crear elementos option
  features.forEach((feature) => {
    const option = document.createElement('option');
    option.value = feature.id;
    option.text = feature.title + " " + feature.id;
    dropdownFeature.appendChild(option);
  });
  
}