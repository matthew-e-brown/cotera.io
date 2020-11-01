<template>
  <main id="about" class="sticky-box">
    <h2>About &amp; FAQ</h2>
    <section id="about">
      <h3>About</h3>
      <p>
        <strong>Cotera.io</strong>, named after the Great Fairy in Kakariko
        Village, is a web-app for tracking armor upgrades in
        <em>The Legend of Zelda: Breath of the Wild</em>. It has two main goals:
        to help you recall which items you need to find to upgrade each piece of
        armor to the next level, and, simply to help you keep track of your
        progress!
      </p>
      <p>
        If you would like to support this project, you can show your
        appreciation financially with my Buy Me a Coffee link; or you can
        contribute to the project by opening an issue on its GitHub page. If you
        have a more general question, you can send me an email. You can find all
        three of these here:
      </p>
      <div id="links">
        <a
          href="https://buymeacoffee.com/matthewbrown"
          target="_blank"
          class="button icon-button"
        >
          <CoffeeIcon
            class="svg-inline--fa fa-w-16"
            aria-hidden="true"
            focusable="false"
            role="img"
          />
          <span>Support</span>
        </a>
        <a
          href="https://github.com/matthew-e-brown/Cotera.io"
          target="_blank"
          class="button icon-button"
        >
          <fa-icon :icon="[ 'fab', 'github' ]" />
          <span>Source code</span>
        </a>
        <a
          href="mailto:matthew.e.brown.17@gmail.com?subject=Question/Concern about Cotera.io"
          target="_blank"
          class="button icon-button"
        >
          <fa-icon icon="envelope" />
          <span>Contact</span>
        </a>
      </div>
    </section>
    <section id="faq">
      <h3>FAQ</h3>
      <dl>
        <dt>
          This site seems to work just fine without an account. Why should I
          make one?
        </dt>
        <dd>
          <p>
            By default, this site will store your current progress inside your
            web browser's local storage. It is saved between browsing sessions,
            but will not survive if ever you decide to <em>clear browsing
            data</em> for this site.
          </p>
          <p>
            Using an account will store your progress in the cloud, allowing you
            to keep it saved indefinitely, no matter how often you clear your
            browsing data, as well as allow it to be accessed from another
            device. If you use multiple devices at the same time, they will all
            update in real-time as you make changes!
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
            primary developer, anybody is free to contribute ideas to the
            project. If you need to submit a bug-report, you can do so
            <a
              href="https://github.com/matthew-e-brown/Cotera.io/issues"
              target="_blank"
            >here</a>.
            If you don't have a GitHub account, you can feel free to send me an
            <a
              href="mailto:matthew.e.brown.17@gmail.com?subject=Cotera.io Bug Report&body=Hi, I've found an issue with Cotera.io."
              target="_blank"
            >email instead</a>.
          </p>
        </dd>
      </dl>
    </section>
    <span id="last">
      <fa-icon title="Made" icon="code" /> with
      <fa-icon icon="heart" title="love" /> in
      <fa-icon :icon="[ 'fab', 'canadian-maple-leaf' ]" title="Canada" /> by
      <a href="https://matthew-brown.net/" target="_blank">Matt</a>, with help
      from <a href="https://theo.works/" target="_blank">Theo</a>.
    </span>
  </main>
</template>

<script>
import CoffeeIcon from '@/assets/icons/bmc-black.svg';

export default {
  name: 'About',
  components: { CoffeeIcon }
}
</script>

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
  margin: 1.5em 0 1em;
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

dd+dt {
  margin-top: 2.5em;
}

#links {
  font-size: 92.5%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

#links a {
  box-sizing: border-box;
  width: max-content;
  margin: 1em;
  padding: 0.75em 2.25em 0.8em 1.55em;
}

#links svg {
  font-size: 175%;
}

#last {
  display: block;
  font-size: 80%;
  font-weight: 300;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  text-align: center;
  border-top: 0.05em solid var(--body-text-2);
}

#last svg {
  margin: 0 0.25em;
}
</style>