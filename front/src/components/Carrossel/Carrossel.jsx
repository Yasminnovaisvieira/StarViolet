import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

/* Importando CSS do Swiper */
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* Importando seu CSS */
import './Carrossel.css';

function Carrossel({ destaques }) {
    
    /* Não renderiza nada se não tiver filmes */
    if (!destaques || destaques.length === 0) return null;

    return (
        <section className="containerCarrossel">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}    /* Sem espaço entre slides */
                slidesPerView={1}   /* Apenas um slide visível por vez */
                navigation      /* Habilita setas de navegação */
                pagination={{ clickable: true }}    /* Habilita paginação (bolinhas) */
                loop={true}     /* Habilita loop infinito */
                autoplay={{delay: 5000, disableOnInteraction: false, }}
                className="swiperContainer"
            >
                {/* .map() no array de destaques */}
                {destaques.map((destaque) => (
                    /* Cada item do array vira um SwiperSlide */
                    <SwiperSlide key={destaque.id}>
                        <div className="carrosselSlide" style={{backgroundImage: `var(--gradiente-carrossel), url(${destaque.poster})`}}>
                            <div className="carrosselConteudo containerInterno">
                                <h2 className="tituloCarrossel">
                                    {destaque.titulo} <span className="anoCarrossel">({destaque.ano})</span>
                                </h2>
                                <p className="sinopseCarrossel">{destaque.sinopse}</p>
                                <div className="acoesCarrossel">
                                    <Link to={`/filmes/${destaque.id}`} className="botaoCarrossel">Ver Detalhes</Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default Carrossel;