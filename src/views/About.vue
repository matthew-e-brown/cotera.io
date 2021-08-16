<template>
  <main id="about-and-faq" class="sticky-box">
    <h2>About &amp; FAQ</h2>

    <section id="about">
      <h3>About</h3>

      <p>
        <span class="cotera">Cotera.io</span>, named after the Great Fairy in
        Kakariko Village, is a website and web-app designed to help you track
        your armor upgrades in <em>The Legend of Zelda: Breath of the Wild</em>
        and make it easier to remember which items you need for that next
        upgrade.
      </p>
      <p>
        In <em>Breath of the Wild,</em> the only way to check which items your
        armor needs for its next upgrade is to trek all the way back to the
        closest Great Fairy: this is super annoying if you're all the way out in
        the mountains already hunting for items.
        <span class="cotera">Cotera.io</span> aims to solve this grievance!
      </p>
    </section>

    <section id="support">
      <h3>Support</h3>

      <p>
        <span class="cotera">Cotera.io</span> doesn't have any ads and is 100%
        free. So, if you would like to support this project, you can show your
        appreciation financially with my <em>Buy Me a Coffee</em> link. You can
        also contribute to the project more directly by opening an issue on its
        GitHub page (Cotera is open-source!). If you have a more general
        question, you can send me an email.
      </p>

      <p>Links to all three of these are here:</p>

      <div id="links">
        <a class="icon-button" href="https://buymeacoffee.com/matthewbrown" target="_blank" rel="noopener">
          <CoffeeIcon class="fa-fw svg-inline--fa" aria-hidden="true" focusable="false" role="img" />
          <span>Donations</span>
        </a>

        <a class="icon-button" href="https://github.com/matthew-e-brown/cotera.io" target="_blank" rel="noopener">
          <fa-icon :icon="[ 'fab', 'github' ]" fixed-width />
          <span>GitHub</span>
        </a>

        <a class="icon-button" href="mailto:matthew.e.brown.17@gmail.com?subject=Question/Concern about Cotera.io" target="_blank" rel="noopener">
          <fa-icon icon="envelope" fixed-width />
          <span>Contact</span>
        </a>
      </div>

      <p>
        Most importantly, if you like <span class="cotera">Cotera.io</span>,
        tell your friends about it! Nothing would make me happier than to see
        this project become helpful to as many people as possible.
      </p>
    </section>

    <section id="faq">
      <h3>FAQ</h3>

      <dl>
        <dt>
          Does <span class="cotera">Cotera.io</span> have an app?
        </dt>
        <dd>
          <p>
            Yes, you're using it right now!
            <span class="cotera">Cotera.io</span> is what's known as a
            <em>Progressive Web App</em>, or <em>PWA</em> for short. That means
            that when you <em>Add to Home Screen</em>, it will install as an
            actual app and even work offline. You can even do this on a computer
            and have it open as its own app there too!
          </p>
          <p>
            The exact method for adding to your home screen differs per device,
            but you can find <a
              href="https://www.macrumors.com/how-to/add-a-web-link-to-home-screen-iphone-ipad/"
              target="_blank"
              rel="noopener"
            >instructions for iOS</a> and <a
              href="https://www.wikihow.com/Set-a-Bookmark-Shortcut-in-Your-Home-Screen-on-Android"
              target="_blank"
              rel="noopener"
            >instructions for Android</a> here.
          </p>
        </dd>

        <dt>
          This site seems to work just fine without an account. Why should I
          make one?
        </dt>
        <dd>
          <p>
            By default, your progress is stored inside your browser's local
            memory. It's saved between browsing sessions, so if you only intend
            to use <span class="cotera">Cotera.io</span> on one device, you
            don't need an account. Just note that your data <strong>will not
            survive</strong> if you decide to <em>clear your browsing data</em>
            for this site.
          </p>
          <p>
            Using an account will store your progress in the cloud, allowing you
            to keep it saved indefinitely. More importantly, however, it'll also
            let you access your progress from more than one device. Updates made
            on one device will sync across to other open devices in real-time,
            too!
          </p>
        </dd>

        <dt>
          Is this site secure? Are you being smart about what happens to my
          data?
        </dt>
        <dd>
          <p>
            <span class="cotera">Cotera.io</span> does not collect any data from
            you for any purposes other than logging you in: period. No analytics
            are enabled for this site, either.
          </p>
          <p>
            As for security/encryption, all your authorization is handled behind
            the scenes by <em>Firebase</em> (which is made by Google), not by
            Cotera itself. If you can trust Google's security, you have nothing
            to worry about.
          </p>
        </dd>

        <dt>
          I found a bug&nbsp;/&nbsp;I have a feature request. What should I do?
        </dt>
        <dd>
          <p>
            I'm glad you ask! If you need to submit a bug report or have an idea
            you want to share, please do so by
            <a
              href="https://github.com/matthew-e-brown/Cotera.io/issues"
              target="_blank"
              rel="noopener"
            >opening an issue on GitHub</a>.

            If you don't have a GitHub account, you can feel free to
            <a
              href="mailto:matthew.e.brown.17@gmail.com?subject=Cotera.io Bug Report&body=Hi, I've found an issue with Cotera.io."
              target="_blank"
              rel="noopener"
            >send me an email directly</a> (just make sure to keep
            "<span class="cotera">Cotera.io</span>" in the subject line).
            I'd be glad to hear from you!
          </p>
        </dd>
      </dl>
    </section>

    <span id="last">
      <fa-icon title="Made" icon="code" /> with
      <fa-icon title="love" icon="heart" /> in
      <fa-icon title="Canada" :icon="[ 'fab', 'canadian-maple-leaf' ]" /> by
      <a href="https://matthew-brown.net/" target="_blank" rel="noopener">Matt</a>,
      with help from <a href="https://theo.works/" target="_blank" rel="noopener">Theo</a>.
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
// We're stealing the sticky-box's styles but aren't actually using its
// stickiness
@include standalone-sticky(calc(50rem + 5vw), 4.5rem);
main.sticky-box { position: static; }

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

  // Stop Cotera and em from having extra spacing above them
  span.cotera, em { line-height: 1em; }
}

a:not(.icon-button) {
  color: $fg-color-dim;
  font-weight: 500;
}

strong {
  font-weight: 700;
}

dt, span.cotera {
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

  border-top: 0.1rem solid $bg-color-accent;

  svg { margin: 0 0.25em; }
}
</style>