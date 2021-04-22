import { GetStaticProps } from "next";
import Image from "next/image";
import { useEffect } from "react"
import Link from "next/link";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./home.module.scss";
//SPA
//SSR
//SSG

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  //episodes: Array<Episode>
  allEpisodes: Episode[],
  latestEpisodes: Episode[],

}

//export default function Home(props) {
//console.log(props.episodes)
export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
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
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>
          Últimos lançamentos
        </h2>
        <ul>
          {
            latestEpisodes.map(episode => {
              // NEXT Image tem essa feature, que ele trata imagens de forma automatica, se a imagem for muito grande, ele ja otimiza com essa tag fonecendo o tamanho
              // Ele não é apenas a o tamanho da imagem, mas o tamanho que a imagem vai ser CARREGADA
              // PRECISA APENAS CONFIGURAR O ARQUIVO NEXT.CONFIG.JS PARA IMAGENS DE OUTROS DOMINIOS
              //<Image width={192} src={episode.thumbnail} alt={episode.title} />


              // NEXT Link tem essa feature, que ele trata o redirecionamento atravez de ancoras sem ter que carregar budles ja persistidos na hoem
              //<Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
              return (
                <li key={episode.id}>
                  <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
                    <p>
                      {episode.members}
                    </p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar" />
                  </button>
                </li>
              )
            })
          }
        </ul>

      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}><Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" /></td>
                  <td><Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link></td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>

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
/*export async function getStaticProps() {
  const response = await fetch("http://localhost:3337/episodes")
  const data = await response.json()
  return {
    props: { episodes: data },
    revalidate: 60 * 60 * 8 //PARAMETRO IMPORTANTE PARA O STATIC, DELIMITA QUANTO TEMPO ESSA VERSÃO ESTATIVA VAI DURAR (60*60*8 = 8 HORAS)
    //SSG SÓ FUNCIONA EM PRODUÇÃO
  }
}*/
//Decalrado as propriedades(props), lembrar do props que a classe leva como parametro


//Usando o GetStaticProps do Next para tipar o retorno
export const getStaticProps: GetStaticProps = async () => {
  //const response = await api.get('http://localhost:3337/episodes?_limit=12&_sort=published_at&_order=desc')
  //const data = response.data

  //const { data } = await api.get('episodes?_limit=12&_sort=published_at&_order=desc')

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBr }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })
  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      allEpisodes: allEpisodes,
      latestEpisodes: latestEpisodes,
    },
    revalidate: 60 * 60 * 8
  }
}
