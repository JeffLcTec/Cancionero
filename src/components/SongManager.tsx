import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SongItem } from './SongItem';
import { AddSongModal } from './AddSongModal';
import { EditSongModal } from './EditSongModal';
import { generateSongbookPDF } from '../utils/pdfGenerator';
import { Plus, Download, Search } from 'lucide-react';
import type { Song } from '../types/song';

const API_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:8787';

// ===== Semilla inicial (igual a la tuya) =====
const defaultSongs: Song[] = [
  {
    id: '1',
    name: 'Padre Nuestro — Bethel Music',
    lyrics: `INTRO //B-G#m-E//

          B                  E              F#
Padre nuestro en los cielos Santo es Tu nombre
    B                   E                 F#
Que venga Tu reino  Tu voluntad también

C o r o

      E       C#m       G#m            F#
Aqui como   en, el cielo  Que el cielo venga
    E    C#m         G#m        F#  B
Aqui  como en el cielo  Que venga aqui

 interludo: B-G#m-E-B

          B                 E              F#
Padre nuestro en los cielos Santo es Tu nombre
    B             E                 F#
Que venga Tu reino  Tu voluntad también

  E       C#m       G#m            F#
Aqui como   en, el cielo  Que el cielo venga
 E      C#m      G#m         F#     E
Aqui  como en el cielo  Que venga aqui

////E-(F#-G#m)-F#-E////

p u e n t e

        E                          F#
Tuyo es el reino,  tuyo el poder,
G#m                   D#m
Tuya es la gloria, por siempre, Amén
          E                       F#
Tuyo es el reino,  tuyo el poder,
G#m                    F#
Tuya es la gloria, por siempre, Amén`,
    chords: 'Intro: B - G#m - E (var.) | Prog: E - C#m - G#m - F#',
    isSelected: false,
  },
  {
    id: '2',
    name: 'Con Poder — Barak',
    lyrics: `VERSE:
    Bm
Espíritu de Dios
       G
llena todo este lugar
     D         A
Desciende una vez mas (2)

CORO:
       Bm         G
Con poder. Con poder.
               D
Desciende una vez mas
           A
y llena este lugar (2x)

PUENTE:
       Bm
Quiero ver gente danzar
       G
Quiero oír la gente hablar
         D                 A
lenguas celestiales, sobrenaturales`,
    chords: 'Bm - G - D - A',
    isSelected: false,
  },
  {
    id: '3',
    name: 'Espíritu Santo Ven — Barak',
    lyrics: `INTRO: Em D C B    "8 TIEMPOS CADA NOTA"

Em                           D
Estoy aquí, desesperado por ti
             C                        B
Con un corazón sediento, que espera beber
de ti

C
Cuando tu gloria desciende a un lugar
D
Toda la tierra tiene que adorar
Am7
Resucitan los muertos se sanan enfermos
    Bsus4-B
por tu poder.
C
Queremos de ti llénanos de ti
D
Espíritu santo envuélvenos en ti
Am7                     Bsus4     B
Derrama tu gloria, Esperamos por ti

CORO:
Em
Ven, ven, ven espíritu santo
D
Ven, ven, ven espíritu santo
C                            Bsus4-B
Ven, ven, ven llena este lugar

                 F#m   E   D   C#sus4   C#   F#m
sube de tono :

Version Corregida.

By: junes M.`,
    chords: 'Em - D - C - B (sube a F#m - E - D - C#)',
    isSelected: false,
  },
  {
    id: '4',
    name: 'Unción en el Aire — World Worship',
    lyrics: `INTRO: // Cm D# G# //

ESTRIBILLO:

      Cm
 Yo no sé que tenía Daniel
             A#
que cuando oraba leones callaba
     Fm
yo no sé que tenía Elías
           G#            G7
que profetizaba y fuego caía
     Cm
yo no sé que tenía Moisés
                 A#
que al bajar del monte él resplandecía
     Fm
yo no sé que tenía Samuel
               G#             A#
que la voz del Padre él reconocía

 PUENTE:

                   Cm
 // Pero hay una unción en el aire
 D#                  G#
y lo que me cueste quiero entregarte
            D#
hoy derramarás tú espíritu
              G7
y tus hijos profetizarán //

ESTRIBILLO:

      Cm
 Yo no sé que tenía Daniel
             A#
que cuando oraba leones callaba
     Fm
yo no sé que tenía Elías
          G#            G7
que profetizaba y fuego caía
     Cm
yo no sé que tenía Moisés
                 A#
que al bajar del monte él resplandecía
     Fm
yo no sé que tenía Samuel
               G#             A#
que la voz del Padre él reconocía

 PUENTE:

                   Cm
 // Pero hay una unción en el aire
 D#           G#
y lo que me cueste quiero entregarte
           D#
hoy derramarás tú espíritu
              G7
y tus hijos profetizarán //

             Cm
 // Yo veo señales, yo veo milagros
    D#    G#
yo veo tinieblas hoy retroceder
        D#             G7
y ése mover está sobre mí //

 SOLO DE GUITARRA: // G# A# Fm G7 //

                    Cm       D#     G#
 //// Esa unción llegó, la puedo sentir
         D#            G7
y ese mover está sobre mí ////

              Cm
 //// Yo veo señales, yo veo milagros
    D#     G#
yo veo tinieblas hoy retroceder
        D#             G7
y ése mover está sobre mí ////

  Cm D# G# D# G7

           Cm
 ////// El fuego llegó, me consumió
 D#        G#               D#
no soy el mismo, no soy el mismo
           G7
no soy el mismo //////

               Cm
 // Yo veo señales, yo veo milagros
    D#    G#
yo veo tinieblas hoy retroceder
        D#             G7
y ése mover está sobre mí //

                  Cm        D#     G#
 // Esa unción llegó, la puedo sentir
         D#            G7
y ese mover está sobre mí //

 Cm....

 INTERLUDIO ///// Cm D# G# D# G7 /////

            Cm
 No soy el mismos, no soy el mismo
 D#        G#               D#
no soy el mismo, no soy el mismo
           G7
no soy el mismo

             Cm
 // Yo veo señales, yo veo milagros
    D#    G#
yo veo tinieblas hoy retroceder
         D#            G7
y ése mover está sobre mí //
            Cm
 Está sobre mi

 // Cm D# G# //`,
    chords: 'Cm - D# - G# (var. con G7, A#)',
    isSelected: false,
  },
  {
    id: '5',
    name: 'Quién como Él — Natalie Billini',
    lyrics: `Intro: // G - Em - C - D //

VERSO
Em         B7
Quien como El
C             G          D/F#    Em
Nada iguala su gloria y su poder
Em             B7
Grande es su amor
C                   G
Su majestad me consume
       D/F#       C
Me cautiva su voz

PRE-CORO
                G                    D     C
Cielo y tierra canta santo es el señor
          G             D
Elevo mi alma en adoración

CORO 1
G                      D
Su gloria llena el universo
Am                      Em
Y su mirada es como estruendo
    D         G
Que hace temblar
                      D
Su voz es como dulce viento
Am                   Em
Por su palabra todo acaba
   D             C  Em   D   Am
Y vuelve a empezar

CORO 2
   D             C    Em
Y vuelve a empezar
            D    Am
vuelve a empezar...
                  C      Em
todo vuelve a empezar
            D               Am
vuelve a empezar... ehhhhhhhh ohhhhhhhh

// C Em D Am //

PUENTE
    C          Em
////Quién como Él,
          D         Am
Quien como Él////`,
    chords: 'G - Em - C - D (var.)',
    isSelected: false,
  },
  {
    id: '6',
    name: 'Cuando Adoro — Jesús Worship Center',
    lyrics: `Intro: C#m(4) - B(4) - F#m(4) - B(4)

C#m           E
Mi deleite es
           B
buscar tu rostro
     F#m     A
mi pasiòn
                 B
postrarme a tus pies

C#m               E
Lo que anhelo mas
          B
sentirte cerca
        F#m         A
y disfrutarte señor
          B
en intimidad

Pre coro:
A
Quiero vivir
en tu habitacion
B
Quiero vivir
en tu habitacion
F#m
llenarme de ti
enciende el altar
        B
aqui estoy

Coro 1:
             C#m
/ / Cuando adoro, cuando canto
              B
Yo siento el fuego, del espiritu santo
         A
Cuando adoro, cuando canto
            F#m              B
Siento el poder del espiritu santo / /

****REPITE DESDE PRINCIPIO****

Luego:

Solo de guitarra: C#m - G#m - A - F#m

Puente:
C#m         G#m
Quebrantame   saturame
A
 quiero mas de ti
 quiero mas de ti
F#m
 quiero mas de ti //

Pre coro:
A
Quiero vivir
en tu habitacion
B
Quiero vivir
en tu habitacion
F#m
llenarme de ti
enciende el altar
        B
aqui estoy

Coro 1:
             C#m
/ / Cuando adoro, cuando canto
              B
Yo siento el fuego, del espiritu santo
         A
Cuando adoro, cuando canto
            F#m              B
Siento el poder del espiritu santo / /

Coro 2:
    C#m
////Cuando adoro, me restauras
    G#m
    Cuando adoro, me levantas
    A
    Cuando adoro, tu me sanas
    F#m
    Cuando adoro, cuando adoro ////`,
    chords: 'C#m - B - A - F#m (var.)',
    isSelected: false,
  },
  {
    id: '7',
    name: 'Jesús — Barak',
    lyrics: `Intro( solo notas , piano)

Izquierda      Derecha
    A             B
                 A,G#
    B             D#
    G#            B
                 A,G#
    A             C#

Estrofa:
          A              B
Quién soy yo para que me ames?
            G#m                        C#m-B
Un ser imperfecto y Tú perfecto eres Señor

             A                B
Tú eres el Dios que aún del polvo
           G#m                     C#m-B
Ensució sus manos y con sangre me lavó

Pre coro:
F#m7
Coronado estás en gloria
A
Hoy los ángeles te adoran
E                     B
¿Cómo no te voy a adorar?

              A
Tu nombre Santo es
           F#m7
Nombre sin igual
     C#m
Jeeeesús
      B
Jeeeesús

Coro:
     A
Admirable, Consejero
       B
Padre fuerte, Príncipe de paz
    C#m
Admirable, Consejero
      G#m
Padre fuerte, Príncipe de paz`,
    chords: 'A - B - G#m - C#m (var.)',
    isSelected: false,
  },
  {
    id: '8',
    name: 'Haz Llover — José Luis Reyes',
    lyrics: `Intro:  Am  G  Dm   Dm - Em - F

     Am                 G
Haz llover,sobre este lugar,
                  Dm
sediento estoy de Ti.
Dm - Em - F                          Am
Ven  y   sacia hoy la sed que hay en mí,
           G
Lléname de Ti,
           Dm           F                Am  F  Am  F
Ven que necesito que refresques mi interior.

Am                    G
Ven que quiero más de Ti,
                  Dm
Haz me rebozar mi copa hasta sentir,
Dm - Em - F                            Am
Tu   pre-sencia estremeciendo mi interior,
          G
Ven y tócame,
        Dm          F           Am   Am-Am  G-G
y abrázame, envuelveme en ti Señor.

Coro:
C             G
  Tu lluvia está cayendo,
Dm          Am
  Tu gloria descendiendo,
C            G            F
  Tu fuego está ardiendo en mí.
C             G
  Tu lluvia está sanando,
Dm          Am
  Tu gloria restaurando,
C            G            F
  Tu fuego está, hoy sobre mí.

Am                    G
Ven que quiero más de Ti,
                  Dm
Haz me rebozar mi copa hasta sentir,
Dm - Em - F                            Am
Tu   pre-sencia estremeciendo mi interior,
          G
Ven y tócame,
        Dm          F           Am   Am-Am  G-G
y abrázame, envuelveme en ti Señor.

Coro:
C             G
  Tu lluvia está cayendo,
Dm          Am
  Tu gloria descendiendo,
C            G            F
  Tu fuego está ardiendo en mí.
C             G
  Tu lluvia está sanando,
Dm          Am
  Tu gloria restaurando,
C            G            F
  Tu fuego está, hoy sobre mí

Puente:
   C    G     Dm  Am   C    G    F
//Llu..via    Ca...e,  hoy sobre mi//`,
    chords: 'Am - G - Dm - Em - F (var.)',
    isSelected: false,
  },
  {
    id: '9',
    name: 'Voy Corriendo — Llévame de Vuelta',
    lyrics: `ACORDES: A  E/G#  F#m7  D
INTRO: D-C#-A

VERSO:1
   A               E/G#    F#m7         D
/Puedo oír tu dulce voz, llamando, estás llamando
  A               E/G#     F#m7          D
Puedo oír tu dulce voz, llamando, estás llamando
  A                 E/G#   F#m7                D
Puedo mirar en tus ojos, con llamas de amor
 A      E/G#     F#m7    D
Diciendo ven, diciendo ven/

CORO:
    A         E/G#
/Y yo voy, y yo voy
   F#m7              D
Voy corriendo a tus brazos
    A                 D
Voy corriendo a tu regazo/

INTRO  //D-C#-A//

   A                  E/G#
//Mas si yo pudiera pintar el cielo
                F#m7
Yo pintaría tu nombre
               D        A
Escribiría tu nombre, Jesús
  A                E/G#
Mas si yo pudiera pintar el cielo
                 F#m7
Yo pintaría tu nombre
                D        A
Escribiría tu nombre, Jesús//

 A
Ohh ohh ohh ohh
E/G#
Ohh ohh ohh ohh
F#m7
Ohh ohh ohh ohh
 D
Ohh ohh ohh ohh

CORO
   A             E/G#
///Y yo voy... y yo voy
     F#m7           D
Voy corriendo a tus brazos
       A             D
Voy corriendo a tu regazo
     A         E/G#
Y yo voy, y yo voy
      F#m7            D
Voy corriendo a tus brazos
       A             D
Voy corriendo a tu regazo///

FINAL
  A                     E/G#
//Siéntete cómodo aquí, siéntete bienvenido aquí
 F#m7                  D                A
No hay otro sentido, solo importa Tú, Jesús
 A                   E/G#
Y lo que hay en Ti, que fluya como un río
F#m7                 D
Impártenos tu amor, danos tu corazón//`,
    chords: 'A - E/G# - F#m7 - D',
    isSelected: false,
  },
  {
    id: '10',
    name: 'Rodeado — (Hope)',
    lyrics: `Intro: Dm. Bb   Gm   C/Bb   C
Piano:   E C  E C  E     E C

Estrofa 1:
F
Derramo mi perfume
Bb
Aunque no te pueda ver
F/Dm  C/E      F
Tú me prometiste
Bb          C(segunda vez)
que nunca me dejaras

Pre-coro:
   Gm
Veo ángeles
Bb         F      C/E
rodear este lugar oh oh oh
   Gm       Bb          A
Veo ángeles rodear este lugar

Coro:
  Dm7
//Estoy rodeado, rodeado, rodeado
                  C
De una gloria que no veo, no veo, no veo
                     Bb                    Gm
Son mirarte yo te siento, te siento, te siento
                      A7
Y no puedo de ti escapar//

Pre- coro
Coro x2

Instrumental Puente 1: Dm Bb F Am X2

Dm
 Tu manto cubre el templo
Bb
 Tu gloria aquí esta
F                  Am
No me puedo resistir, Ante tu majestad X6

Coro X2
Puente 2: Dm Bb Gm A x4
Rodéame

Dm.                                  C
Lléname, Lléname, Lléname con tu presencia
                                    Bb
Lléname, Lléname, Lléname con tu poder
               Gm.                 A
Lléname, Lléname, Lléname con tu amor`,
    chords: 'Dm - Bb - Gm - C (var.)',
    isSelected: false,
  },
  {
    id: '11',
    name: 'Yahweh — (Oasis Ministry)',
    lyrics: `Em7                         Bm
Se siente tu gloria en este lugar
                   C
Algo grande va a pasar
                      D
Se activa lo sobrenatural

Em7                          Bm
Se siente tu gloria en este lugar
                   C
Algo grande va a pasar
                      D
Se activa lo sobrenatural

C         D        Bm
Yahweh, rafa, elohim
Em7       C      D
Shaddai, jireh, adonai
Em7
Se manifestará

Em7
Si le adoras él se manifestara
D
Si le llamas él se manifiesta
C                              ( Bm )
Se le muscas él se manifestará

   Em7
Yahweh se manifestará
   D
Jireh se manifestará
   C
Rafa se manifestará
               ( Bm )
Se manifestará

Em7
Si le adoras él se manifestara
D
Si le llamas él se manifiesta
C                              ( Bm )
Se le muscas él se manifestará`,
    chords: 'Em7 - Bm - C - D',
    isSelected: false,
  },
  {
    id: '12',
    name: 'Lléname — (Harold Guerra)',
    lyrics: `Intro
A D

Estrofa I
A          Bm
Te vengo a buscar
E            A
Hoy necesito adorarte
           Bm
Me vengo a postrar
E             A
Hoy necesito llenarme

coro
       A/C#  D                   A
Que tu presencia llene todo este lugar
          D                      A
Que tu presencia llene todo este altar
F#m         D     A
Lléname, lléname de ti

F#m E Bm

puente
F#m   E         Bm
Lléname, luz de mi vida
F#m   E         Bm
Lléname, fuente de agua vida
F#m   E        Bm
Lléname, Jesus mi deseo
F#m  E         Bm     D
Lléname, Jesus mi anhelo`,
    chords: 'A - D - E - F#m (var.)',
    isSelected: false,
  },
  {
    id: '13',
    name: 'Quiero mirar tu hermosura — Marco Barrientos',
    lyrics: `INTRO: ///G, A, D/// SE REPITE 3
VECES LUEGO VA ESTO (Em, A, D)
En conclusión;
El intro se lo toca 2 veces todo..

Verso
D               A                G      A
Dios, me abro a Ti, me entrego a ti, Jesús
          G               Bm
Estoy dispuesto y en tus manos
          Em     A
Lo rindo todo, Señor

Puente
  Bm            G
Abre mis ojos, déjame verte
Em               G            A
Quita las vendas que me han cegado
  Bm            G
Abre mis ojos, yo quiero verte
Em                G          A
Muestra tu gloria y tu gran bondad

Coro
G        A         Bm
Quiero mirar tu hermosura
G         A         D
Y contemplar tu majestad
G        A         Bm
Abre mis ojos, Jesucristo
Em         A          D        A
Muestra tu gloria y tu bondad

SOLO: ////G, A, Bm - G, A, D   - G, A, Bm   -  G, A, D////

FINAL: el final solo se toca ///G, A, D///`,
    chords: 'G - A - D (var.)',
    isSelected: false,
  },
  {
    id: '14',
    name: 'Majestad — (Claudio Freidzon / Ingrid Rosario / varias versiones)',
    lyrics: `Intro: Am G2 F //

Am   G    F
Aquí estoy
 Em                     F
Me humillo ante Tu Majestad
 Em                   G/B  E/G#
cubierto por tu gracia y poder
Am   G    F
Aquí Estoy
 Em            F
Sabiendo que yo soy pecador
 Em               G/B  E/G#
Redimido por la Sangre de El

Bridge
Am7   G/B    C
Y ya encontré
           E/G#    Am7    G/B     C
El amor mas grande para mi
              Dsus/F#
Sufriste hasta morir
              F
Todo por amor

Chorus:
 C       G     Am7   F
Majestad, Majestad
    C                      G E/G#
Tu gracia me encontró como soy
    Am                      F
Con manos vacias pero vivas en Ti

Am   G    F
Aquí estoy
 Em                     F
Postrado ante el amor que me das
 Em                      G/B  E/G#
Perdonado para yo perdonar
Am   G    F
Aquí estoy
 Em                       F
Sabiendo que tu anhelo yo soy
 Em               G/B   E/G#
Santificado por tu fuego y poder

Bridge
Am7   C      G/B
Y ya encontré
           E/G#    Am7    C    G/B
El amor mas grande para mi
              Dsus/F#
Sufriste hasta morir
              F
Todo por amor

Chorus:
 C     G    Am   F
Majestad, Majestad
    C                   G   E/G#
Tu gracia me encontró como soy
Am                  F
Con manos vacías pero vivas en Ti

C     G    Am   F
Majestad, Majestad
    C                    G E/G#
por siempre cantare de tu amor
Am                      F
en la presencia de Tu Majestad

Majestad (Espacio musical, las mismas notas del intro: Am G2 F)

Chorus:
 C     G    Am   F
Majestad, Majestad
    C                   G   E/G#
Tu gracia me encontró como soy
Am                  F
Y no soy nada pero vivo por Ti

C     G    Am   F
Majestad, Majestad
    C                    G E/G#
por siempre cantare de tu amor
Am                      F
en la belleza de Tu Majestad`,
    chords: 'Am - G2 - F (var.)',
    isSelected: false,
  },
  {
    id: '15',
    name: 'Está cayendo su gloria sobre mí — José Luis Reyes',
    lyrics: `Intro: //G-Em-C-D// (en LA segunda vuelta entra percusión)

G                Am
//Algo cayendo aquí
D                     G
 Es tan fuerte sobre mí
Em                 Am
 Mis manos levantaré
D                 G  C-G
 Y su Gloria tocaré//

D         G                    D
 Está cayendo, su Gloria sobre mi
            Am                  G-C
 Sanando heridas, levantando al caído
                   D
 Su Gloria está aquí//

                     //Em-D-Am-D// G
 ///Su Gloria está aquí///

G               Am
 Algo cayendo aquí
D                     G
 Es tan fuerte sobre mí
Em                 Am
 Mis manos levantaré
D                 G  C-G
 Y su Gloria tocaré

D            G                    D
 //Está cayendo, su Gloria sobre mi
            Am                  G-C
 Sanando heridas, levantando al caído
                   D
 Su Gloria está aquí//`,
    chords: 'G - Em - C - D (var.)',
    isSelected: false,
  },
  {
    id: '16',
    name: 'La tierra canta — Barak',
    lyrics: `Bm                       G                      D    A
Se abren los Cielos, se escucha un sonido celestial
Bm                   G                       D       A
Unido a las voces, de un pueblo que te quiere adorar
Bm                      G                  D      A
El Espíritu de Dios, se mueve libre en este lugar
Bm                        G                 D         A
El Padre alegre está, al ver la novia a unirse adorar   (se escucha)

Bm              G
La tierra canta, el cielo adora
D               A
 Y todos gritan   que Tú eres santo

Bm                         G
Angeles se unen hoy, cantamos a una sola voz
D      A
Santo, santo`,
    chords: 'Bm - G - D - A',
    isSelected: false,
  },
  {
    id: '17',
    name: 'Preciosa Sangre — (Marco Barrientos)',
    lyrics: `INTRO: Bm - A - F#m - C#m

Bm         A          F#m    C#m
Preciosa sangre se derramó
Bm         A              F#m    C#m
Preciosa sangre fluyó por amor
Bm             A
Sobre ti el dolor
F#m          D
Tus venas lloraron
 A       F#m    C#m    E
Jesús, Jesús, Jesús.

CORO:
D                A
Hay poder en la sangre
F#m           E
Que fluyó por amor
D                A
Hay poder en la sangre
            E
Que Él derramó.

Bm         A               F#m    C#m
Preciosa sangre que me purificó
Bm         A                 F#m    C#m
Preciosa sangre que me transformó
Bm            A
Sobre ti el dolor
F#m            D
Tus venas lloraron
 A       F#m    C#m    E
Jesús, Jesús, Jesús.

(CORO)

PUENTE:
     Bm         F#m
//Tu sangre me transformó
   D         A     E
Tu sangre me perdonó
   Bm     F#m
Tu sangre me limpió
 C#m (E)
Tu sangre me sanó
   E
Tu sangre me sanó//

(CORO)

Bm - F#m - D - A - E
Bm - F#m - C#m - E`,
    chords: 'Bm - A - F#m - C#m (var.)',
    isSelected: false,
  },
];

// ===== Componente =====
export function SongManager() {
  const [songs, setSongs] = useState([] as Song[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null as Song | null);

  // -------- Helpers API --------
  async function apiAddSong(
    payload: Omit<Song, "id" | "isSelected" | "selectionOrder">
  ) {
    const res = await fetch(`${API_URL}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo crear");
    return res.json() as Promise<Song>;
  }

  async function apiUpdateSong(id: string, partial: Partial<Song>) {
    const res = await fetch(`${API_URL}/songs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error("No se pudo actualizar");
    return res.json() as Promise<Song>;
  }

  async function persistDiff(prev: Song[], next: Song[]) {
    const byIdPrev = new Map(prev.map((s) => [s.id, s]));
    const updates: Promise<any>[] = [];
    for (const s of next) {
      const p = byIdPrev.get(s.id);
      if (!p) continue;
      const changed =
        p.name !== s.name ||
        p.lyrics !== s.lyrics ||
        p.chords !== s.chords ||
        p.isSelected !== s.isSelected ||
        (p.selectionOrder ?? null) !== (s.selectionOrder ?? null);
      if (changed) {
        updates.push(
          apiUpdateSong(s.id, {
            name: s.name,
            lyrics: s.lyrics,
            chords: s.chords,
            isSelected: s.isSelected,
            selectionOrder: s.selectionOrder ?? undefined,
          })
        );
      }
    }
    if (updates.length) await Promise.allSettled(updates);
  }

  // -------- Carga inicial --------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/songs`);
        const data: Song[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSongs(data);
        } else {
          // Seed automático al backend
          await fetch(`${API_URL}/songs/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              defaultSongs.map((s) => ({
                name: s.name,
                lyrics: s.lyrics,
                chords: s.chords,
              }))
            ),
          });
          const res2 = await fetch(`${API_URL}/songs`);
          const seeded: Song[] = await res2.json();
          setSongs(seeded);
        }
      } catch (e) {
        console.error(e);
        setSongs(defaultSongs); // fallback si el server no está
      }
    })();
  }, []);

  // -------- Handlers --------
  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

  const selectedSongs = songs.filter((song) => song.isSelected);

  const handleToggleSelect = (id: string) => {
    setSongs((prev) => {
      const targetSong = prev.find((song) => song.id === id);
      if (!targetSong) return prev;

      let updatedSongs: Song[];

      if (targetSong.isSelected) {
        // Deseleccionar
        updatedSongs = prev.map((song) =>
          song.id === id
            ? { ...song, isSelected: false, selectionOrder: undefined }
            : song
        );
        const selected = updatedSongs
          .filter((song) => song.isSelected && song.selectionOrder)
          .sort((a, b) => a.selectionOrder! - b.selectionOrder!);

        updatedSongs = updatedSongs.map((song) => {
          if (song.isSelected && song.selectionOrder) {
            const newOrder = selected.findIndex((s) => s.id === song.id) + 1;
            return { ...song, selectionOrder: newOrder };
          }
          return song;
        });
      } else {
        // Seleccionar
        const maxOrder = Math.max(
          0,
          ...prev
            .filter((song) => song.isSelected && song.selectionOrder)
            .map((song) => song.selectionOrder!)
        );

        updatedSongs = prev.map((song) =>
          song.id === id
            ? { ...song, isSelected: true, selectionOrder: maxOrder + 1 }
            : song
        );
      }

      persistDiff(prev, updatedSongs);
      return updatedSongs;
    });
  };

  const handleAddSong = (
    newSong: Omit<Song, "id" | "isSelected" | "selectionOrder">
  ) => {
    (async () => {
      try {
        const created = await apiAddSong({
          name: newSong.name,
          lyrics: newSong.lyrics,
          chords: newSong.chords,
        });
        setSongs((prev) =>
          [...prev, created].sort((a, b) =>
            a.name.localeCompare(b.name, "es", { sensitivity: "base" })
          )
        );
      } catch (e) {
        console.error(e);
        const song: Song = {
          ...newSong,
          id: crypto.randomUUID(),
          isSelected: false,
          selectionOrder: undefined,
        };
        setSongs((prev) => [...prev, song]);
      }
    })();
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedSong: Song) => {
    (async () => {
      try {
        const saved = await apiUpdateSong(updatedSong.id, updatedSong);
        setSongs((prev) =>
          prev.map((s) => (s.id === saved.id ? saved : s))
        );
      } catch (e) {
        console.error(e);
        setSongs((prev) =>
          prev.map((song) =>
            song.id === updatedSong.id ? updatedSong : song
          )
        );
      } finally {
        setEditingSong(null);
      }
    })();
  };

  const handleDownloadPDF = () => {
    if (selectedSongs.length > 0) {
      const songsInOrder = selectedSongs.sort(
        (a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0)
      );
      generateSongbookPDF(songsInOrder);
    }
  };

  // -------- Render --------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Gestor de Canciones</h1>
        <p className="text-muted-foreground text-lg">
          Administra las canciones de la iglesia y genera cancioneros
          personalizados
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Canción
        </Button>

        <Button
          onClick={handleDownloadPDF}
          disabled={selectedSongs.length === 0}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF ({selectedSongs.length})
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar canciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl">{songs.length}</div>
            <div className="text-sm text-muted-foreground">
              Total de canciones
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{selectedSongs.length}</div>
            <div className="text-sm text-muted-foreground">
              Seleccionadas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{filteredSongs.length}</div>
            <div className="text-sm text-muted-foreground">
              Mostrando
            </div>
          </div>
        </div>
      </div>

      {/* Orden del cancionero */}
      {selectedSongs.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h3 className="mb-3 text-xl font-semibold">
            Orden del Cancionero
          </h3>
          <div className="space-y-2">
            {selectedSongs
              .sort(
                (a, b) =>
                  (a.selectionOrder || 0) - (b.selectionOrder || 0)
              )
              .map((song) => (
                <div key={song.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                    {song.selectionOrder}
                  </div>
                  <span className="text-base font-medium">
                    {song.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lista de canciones */}
      <div className="space-y-3">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm
              ? "No se encontraron canciones que coincidan con la búsqueda."
              : "No hay canciones disponibles."}
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div key={song.id}>
              <SongItem
                song={song}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEditSong}
              />
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddSongModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddSong}
      />

      <EditSongModal
        song={editingSong}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}