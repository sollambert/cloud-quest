import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <p>CloudQuest was developed as a solo capstone project to demonstrate the skills I learned through Prime Digital Academy.</p>
        <p style={{ width: "45em", lineHeight: ".85em", fontSize: "6pt" }}>
          .............................................
          .............................................
          ..=========================================..
          ..=========================================..
          ..=========================================..
          ..=========================================..
          ..=========================================..
          ..=========================================..
          ..======..=========================..======..
          ..=====....,,,,,,,,,,,,,,,,,,,,,,,....=====..
          ..=====...............................=====..
          ..=====...^========================...=====..
          ..======..=========================:.======..
          ..======..=========================:.======..
          ..======..=========================:.======..
          ..======..=========================:.======..
          ..======..=====:=============,=====:.======..
          ..======..====...^==========...====:.======..
          ..======..====.................^===:.======..
          ..======..====...===========...====:.======..
          ..======..=====.-============.=====:.======..
          ..======..=====.-============.=====:.======..
          ..======..=====.-============.=====:.======..
          ..======..=====.-============.=====:.======..
          ..======..=====.-============.=====:.======..
          ..=====...-====.-===========...====...=====..
          ..=====....====.-=====.........^==....=====..
          ..=====....====.-=====^^^^^^...===....=====..
          ..======..=====.-===========^.=====,.======..
          ..======..=====.-==================:.======..
          ..======..=====.-==================:.======..
          ..======..=====.-==================:.======..
          ..======..=====.-==================:.======..
          ..======..====...==================:.======..
          ..======..====.......................======..
          ..======..====.......................======..
          ..======..====^..==========================..
          ..======..=================================..
          ..======..=================================..
          ..======..=================================..
          ..======..=================================..
          ..======..=================================..
          ..======..=================================..
          .............................................
          .............................................
        </p>
        Technologies used:
        <ul>
          <li>React</li>
          <li>Redux</li>
          <li>p5.js</li>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>PostgreSQL</li>
          <li>Heroku</li>
        </ul>
        <p>Special thanks to:</p>
        <ul>
          <li>My family who have supported my initiative to follow my passion for programming</li>
          <li>My friends who have helped keep me sane during the Prime full stack program</li>
          <li>My wonderful instructors throughout the program: Kris Szafranski, Edan Schwartz, Dane Smith, Key Clark, and Vada Karlen</li>
          <li>My dog Ellie who kept me company all winter while I was spending endless hours troubleshooting bugs</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
