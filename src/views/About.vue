<template>
  <main id="about" class="sticky-box">
    <h2>About &amp; FAQ</h2>
    <section>
      <h3 id="faq">FAQ</h3>
      <dl>
        <dt>
          This site seems to work just fine without an account. Why should I make
          one?
        </dt>
        <dd>
          <p>
            By default, this site will store your current progress inside your
            web browser's local storage. It is saved between browsing sessions,
            but will not survive if ever you decide to <em>clear browsing
            data</em> for this site.
          </p>
          <p>
            Using an account will store your progress on a server, allowing you
            to keep your it saved indefinitely, as well as allow it to be
            accessed from another device. When using multiple devices at the
            same time, the other devices will even update in real-time as you
            make changes!
          </p>
        </dd>

        <dt>
          Is this site secure? Are you being smart about what happens to my
          password and to my data?
        </dt>
        <dd>
          <p>
            This site uses Google's Firebase service behind the scenes: they
            handle the authentication and storage. As long as you trust Google,
            you have nothing to fear here. The only information this app
            collects from you is your email address and password, and none of it
            is sent or sold anywhere.
          </p>
        </dd>

        <dt>I found a problem/bug/error. What should I do?</dt>
        <dd>
          <p>
            I'm glad you asked! This web-app is open-source: as much as I am the
            primary developer, anybody is free to contribute to the project. If
            you need to submit a bug-report, you can do so <a
            href="https://github.com/matthew-e-brown/Cotera.io/issues"
            target="_blank" >here</a>.
          </p>
        </dd>
      </dl>
    </section>
    <section>
      <h3 id="about">About</h3>
      <p>
        Thank you for checking out <strong>Cotera.io</strong>! I made this app
        as a passion-project, a resume-filler, and as a tool for myself to use
        as I complete my fourth playthrough of The Legend of Zelda: Breath of
        the Wild.
      </p>
      <p>
        I created this app because, as I strove for 100% completion in my most
        recent Breath of the Wild playthrough, I kept finding myself forgetting
        which items I needed to upgrade my armor through the final levels.
      </p>
      <p>
        I often thought to myself, "wouldn't it be handy to have something I can
        whip out on my phone, or leave open on my second monitor to quickly
        double check what flower I'm looking for?" I used a notepad on my desk
        for a while, but it quickly became messy as I upgraded pieces and
        scratched them off the page.
      </p>
      <p>
        So, as someone trying to get my foot in the door as web developer, I
        figured this would be a fun project to throw myself into. I hope you
        like it!
      </p>
      <p>
        If you're interested, you can find the source code for this project
        <a href="https://github.com/matthew-e-brown/Cotera.io">here</a>, on
        GitHub.
      </p>
    </section>
  </main>
</template>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
/* lighter weight */
@import url('https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,300;1,300&display=swap');

@media (min-width: 770px) {
  main {
    min-width: initial;
    max-width: 95%;
    width: calc(50rem + 5vw);
    padding-left: 4.5rem;
    padding-right: 4.5rem;
  }
}

h3 {
  text-align: center;
}

main, main p {
  /* Lots of reading, we need to give the text some breathing room */
  line-height: 1.55;
}

p {
  font-weight: 300;
  max-width: 80ch;
  margin-left: auto;
  margin-right: auto;
}

a {
  color: var(--body-text-1);
}

dt, strong {
  font-family: 'Calamity', 'Avenir', Arial, Helvetica, sans-serif;
  font-weight: 700;
}

dd {
  margin-bottom: 1.75em;
}
</style>