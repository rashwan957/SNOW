let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                        
                    let tags = '';
    
                    datos.genres.forEach(genre => {
                        if (genre.name != datos.genres[datos.genres.length - 1].name) {
                            tags += `${genre.name}, `
                        } else {
                            tags += datos.genres[datos.genres.length - 1].name
                        }
                    });

                    let creators = '';
    
                    datos.created_by.forEach((creator, i) => {
                        if (i == datos.created_by.length - 1){
                            creators += creator.name
                        } else{
                            creators += `${creator.name}, `

                        }
                    });
    
                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
                        <li>
                            <a href="#!" class="episode">
                                <div class="episode__img">
                                    <img src="https://image.tmdb.org/t/p/w300/${episode.still_path}" onerror="this.style='display:none';">
                                    <div class="episode__no-image"><i class="fa-regular fa-circle-play"></i></div>
                                </div>
                                <div class="epsiode__info">
                                    <h4 class="episode__info__title">${episode.episode_number}. ${episode.name}</h4>
                                    <div class="episode__info__duration">${runtime}</div>
                                </div>
                            </a>
                        </li>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = `    
<div class="post-header">
<div class="image-and-btn">
<img src="https://image.tmdb.org/t/p/w300/${datos.poster_path}" class="poster-img" alt="" />
<div class="fav-js">
<button class="bs-favs" card-id="${datos.id}" id="add-btn"><i class="fa-regular fa-heart"></i> Añadir a mi lista</button>
<button class="delete-btn none-btn" card-id="${datos.id}" id="remove-btn"><i class="fa-solid fa-trash"></i> Borrar de mi lista</button>
</div>
</div>

<div class="post-header__info">
<h1>${datos.name}</h1>
<ul>
<li class="tmdb-rate"><i class="fa-solid fa-star"></i> ${datos.vote_average.toFixed(1)}</li>
<li>${datos.number_of_seasons + genSeasonsCount}</li>
<li>${datos.first_air_date.slice(0,4)}</li>
</ul>
<p class="resume">${datos.overview}</p>
<div class="more-data">
<p>Genre: ${tags}</p>
<p>Created by: ${creators}</p>
</div>
</div>
</div>
<!--more-->
<div class="season-list">
<div class="select-season">
<h2>Episodios</h2>
<select name="" id="select-season">
${seasonsOption}
</select>
</div>

<div id="temps">
<ul class="caps-grid animation" id="season-${seasonNumber}">
${episodeList}
</ul>



</div>
</div>

                    `;
                    
                    let seasonOnly = `
                    <ul class="caps-grid hide" id="season-${seasonNumber}">
                    ${episodeList}
                    </ul>
    
    
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    console.log(justHtml, typeof justHtml)
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                console.log(datos);


                let tags = '';

                datos.genres.forEach(genre => {
                    if (genre.name != datos.genres[datos.genres.length - 1].name) {
                        tags += `${genre.name}, `
                    } else {
                        tags += datos.genres[datos.genres.length - 1].name
                    }
                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<div class="post-header">
    <div class="image-and-btn">
        <img src="https://image.tmdb.org/t/p/w300/${datos.poster_path}" class="poster-img" alt="" />
        <div class="fav-js">
            <button class="bs-favs" card-id="${datos.id}" id="add-btn"><i class="fa-regular fa-heart"></i> Añadir a mi lista</button>
            <button class="delete-btn none-btn" card-id="${datos.id}" id="remove-btn"><i class="fa-solid fa-trash"></i> Borrar de mi lista</button>
        </div>
    </div>

    <div class="post-header__info">
        <h1>${datos.title}</h1>
        <ul>
            <li class="tmdb-rate"><i class="fa-solid fa-star"></i> ${datos.vote_average.toFixed(1)}</li>
            <li>${convertMinutes(datos.runtime)}</li>
            <li>${datos.release_date.slice(0,4)}</li>
        </ul>
        <p class="resume">${datos.overview}</p>
        <div class="more-data">
            <p>Genre: ${tags}</p>
        </div>
    </div>
</div>

<!--more-->

<div class="bs-video-player">
    <ul class="player-options">
        <li class="active">Opcion 1</li>
        <li>Opcion 2</li>
        <li>Opcion 3</li>
    </ul>
    <ul class="bs-iframes">
        <li class="active">IFRAME AQUI</li>
        <li>IFRAME AQUI</li>
        <li>IFRAME AQUI</li>
    </ul>

</div>

<script>
const opcionesVideo=document.querySelector(".player-options").querySelectorAll("li"),videoIframes=document.querySelector(".bs-iframes").querySelectorAll("li");opcionesVideo.forEach((e,o)=>{e.addEventListener("click",()=>{opcionesVideo.forEach((e,o)=>{e.classList.remove("active"),videoIframes[o].classList.remove("active")}),e.classList.add("active"),videoIframes[o].classList.add("active")})});
</script>`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



