const urlFeature = "http://localhost:3000/api/features";

export const getFeatures = async (page=1,perPage=10) => {
  try {
    const url = urlFeature +"?page=" + page +"&per_page="+perPage;
    const resp = await fetch(url);
    const features = await resp.json();

    return features;
  } catch (error) {
    return error;
  }
};

export const getFeaturesFilter = async (selected,page,perPage=10) => {
  try {
    const url = urlFeature +"?page=" + page + "&per_page=" + perPage + "&filters[mag_type]=" +selected;
    const resp = await fetch(url);
    const features = await resp.json();

    return features;
  } catch (error) {
    return error;
  }
};



export const postComment = async (id,comment) =>{
  try {
    const datos = {
      body: comment 
    };
    // Enviar la solicitud POST al servidor
    const url = urlFeature +"/" + id + "/comments";
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    // Verificar si la solicitud fue exitosa (código de respuesta 200-299)
    if (respuesta.ok) {
      return console.log('Comentario enviado correctamente');
      // Aquí puedes realizar alguna acción adicional si es necesario
    } else {
      return console.error('Error al enviar el comentario:', respuesta.statusText);
    }
  } catch (error) {
    return console.error('Error al enviar el comentario:', error);
  }
}

