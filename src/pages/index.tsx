//SPA

import { useEffect } from "react"

//SSR

//SSG

//export default function Home(props) {
//console.log(props.episodes)
export default function Home(props) {
  console.log(props.episodes)
  //SPA
  //Primieiro parametro é o que eu quero executar
  //Segundo parametro é quando -> Se o segundo parametro estiver vazio, ele executa quando o componente for renderizado []
  //  caso um variavel for alocada no segundo parametro, sempre que ela mudar e método será disparado
  /*useEffect(() => {
    fetch("http://localhost:3337/episodes")
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])*/

  return (
    <h1>Hello</h1>
  )
}

//SSR - SERVER SIDE RENDER
//Padrão de nome, sempre que declarado o Next vai chamar esse componente antes de renderizar a pagina pro usuário final
//Será executado sempre que a Home for acessada, 
//BOM USAR QUANDO A PÁGINA EM QUESTÃO FOR SOFRER ALTERAÇÕES DE CONTEUDO
/*export async function getServerSideProps() {
  const response = await fetch("http://localhost:3337/episodes")
  const data = await response.json()
  return { props: { episodes: data } }
}*/
//Decalrado as propriedades(props), lembrar do props que a classe leva como parametro


//SSG - STATIC SIDE GENERATION
//Padrão de nome, sempre que declarado o Next vai chamar esse componente antes de renderizar a pagina pro usuário final
//Será executado uma vez, gerando uma página "estatica" compartilhada entre os usuários, evitando consumir recurso da API, 
//BOM USAR QUANDO A PÁGINA EM QUESTÃO NÃO FOR SOFRER ALTERAÇÕES DE CONTEUDO
export async function getStaticProps() {
  const response = await fetch("http://localhost:3337/episodes")
  const data = await response.json()
  return {
    props: { episodes: data },
    revalidate: 60 * 60 * 8 //PARAMETRO IMPORTANTE PARA O STATIC, DELIMITA QUANTO TEMPO ESSA VERSÃO ESTATIVA VAI DURAR (60*60*8 = 8 HORAS)
    //SSG SÓ FUNCIONA EM PRODUÇÃO
  }
}
 //Decalrado as propriedades(props), lembrar do props que a classe leva como parametro