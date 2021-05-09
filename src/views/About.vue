<template>
  <main id="about-and-faq" class="sticky-box">
    <h2>About &amp; FAQ</h2>

    <section id="about">
      <h3>About</h3>

      <p>
        <strong class="cotera">Cotera.io</strong>, named after the Great Fairy
        in Kakariko Village, is a website and web-app made to help you track
        your armor upgrades in <em>The Legend of Zelda: Breath of the Wild</em>.
        It has two main goals. First, to help you recall the items you need in
        order to upgrade your armor to its next level. Second, simply to let you
        keep track of your progress.
      </p>
      <p>
        If you would like to support this project, you can show your
        appreciation financially with my Buy Me a Coffee link. You can also
        contribute to the project more directly by opening an issue on its
        GitHub page. If you have a more general question, you can send me an
        email. You can find all three of these here:
      </p>

      <div id="links">
        <a class="icon-button" href="https://buymeacoffee.com/matthewbrown" target="_blank">
          <CoffeeIcon class="fa-fw svg-inline--fa" aria-hidden="true" focusable="false" role="img" />
          <span>Donations</span>
        </a>

        <a class="icon-button" href="https://github.com/matthew-e-brown/Cotera.io" target="_blank">
          <fa-icon :icon="[ 'fab', 'github' ]" class="fa-fw"></fa-icon>
          <span>Source code</span>
        </a>

        <a class="icon-button" href="mailto:matthew.e.brown.17@gmail.com?subject=Question/Concern about Cotera.io" target="_blank">
          <fa-icon icon="envelope" class="fa-fw"></fa-icon>
          <span>Contact</span>
        </a>
      </div>

      <p>
        Most importantly, if you like <strong class="cotera">Cotera.io</strong>,
        tell your friends about it! Nothing would make me happier than to see
        this project become helpful to as many people as possible.
      </p>
    </section>

    <section id="faq">
      <h3>FAQ</h3>

      <dl>
        <dt>
          Is there an app for <strong>Cotera.io</strong>?
        </dt>
        <dd>
          <p>
            Yes, you're using it right now!
            <strong class="cotera">Cotera.io</strong> is what's known as a
            <em>Progressive Web App</em>. That means that when you
            <em>Add to Home Screen</em>, it will be more than your typical
            bookmark or shortcut: it will actually install like an app,
            including support for working offline.
          </p>
          <p>
            It's possible your browser has already prompted you to "install"
            this site: if you ignored or missed that prompt, you can simply
            <em>Add to Home Screen</em> like it was a bookmark.
          </p>
        </dd>

        <dt>
          This site seems to work just fine without an account. Why should I
          make one?
        </dt>
        <dd>
          <p>
            By default, your progress is stored inside your browser's local
            storage. It's saved between browsing sessions, but it will not
            survive if you decide to <em>clear your browsing data</em> for this
            site.
          </p>
          <p>
            Using an account will store your progress in the cloud, allowing you
            to keep it saved indefinitely. More importantly, however; it'll also
            let you access your progress from more than one device! You'll even
            be able to see updates happen in real-time if you open it on more
            than one at once.
          </p>
        </dd>

        <dt>
          Is this site secure? Are you being smart about what happens to my
          data?
        </dt>
        <dd>
          <p>
            This site uses Google's <em>Firebase</em> service behind the scenes:
            they handle authentication and data storage. The only information
            <strong class="cotera">Cotera.io</strong> collects from you is your
            email address, if you choose to sign in using an email &amp;
            password. No analytics are enabled for this site either.
          </p>
          <p>
            Additionally, as mentioned above, <strong>all</strong> of the
            source-code for <strong class="cotera">Cotera.io</strong> is
            available on GitHub: if I was doing anything fishy, it would be
            pretty easy for me to get caught.
          </p>
        </dd>

        <dt>
          I found a problem/bug/error. What should I do?
        </dt>
        <dd>
          <p>
            I'm glad you ask! If you need to submit a bug report, or even if you
            just have an idea you want to share, please do so by
            <a
              href="https://github.com/matthew-e-brown/Cotera.io/issues"
              target="_blank"
            >opening an issue on GitHub</a>.

            If you don't have a GitHub account, you can feel free to
            <a
              href="mailto:matthew.e.brown.17@gmail.com?subject=Cotera.io Bug Report&body=Hi, I've found an issue with Cotera.io."
              target="_blank"
            >send me an email directly</a>. I'll be glad to hear from you!
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

<script lang="ts">
import { defineComponent } from 'vue';

import CoffeeIcon from '@/assets/icons/bmc-black.svg';

export default defineComponent({
  name: 'About',
  components: { CoffeeIcon }
});
</script>

<style scoped lang="scss">
@include standalone-sticky(calc(50rem + 5vw), 4.5rem);

h3 {
  text-align: center;
  margin: 1.5em 0 1em;
}

main, main p {
  line-height: 1.55;
}

p {
  font-weight: 300;
  max-width: 80ch;
  margin: 1em auto;

}

a:not(.icon-button) {
  color: $fg-color-dim;
}

strong {
  font-weight: 700;
}

dt, strong.cotera {
  @extend strong;
  font-family: $head-font;
}

dd {
  margin-bottom: 1.75em;
}

dd+dt {
  margin-top: 2.5em;
}

#links {
  font-size: 93%;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;

  a {
    width: max-content;
    margin: 1em;
  }
}

#last {
  display: block;

  font-size: 80%;
  font-weight: 300;

  margin-top: 2.5rem;
  padding-top: 1.5rem;
  text-align: center;

  border-top: 0.05em solid $fg-color-dimmer;

  svg { margin: 0 0.25em; }
}
</style>