// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Code,
  Deck,
  Heading,
  Layout,
  Fill,
  ListItem,
  List,
  Slide,
  Text
} from "spectacle";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  lava: require("../assets/lava.jpg"),
  frozenRiver: require("../assets/frozen-river.jpg")
};

preloader(images);

const theme = createTheme({
  primary: "#FDFDFC",
  secondary: "#151824",
  tertiary: "#19B292",
  quartenary: "#CECECE",
  lava: "#FF243C"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={["zoom", "slide"]} transitionDuration={500} theme={theme}>
        <Slide transition={["zoom"]} bgColor="secondary"
          notes="Look at:<ul><li>Getting started with reactive programming</li><li>Modelling simple use cases w/ streams</li><li>Building a realtime application</li></ul>"
        >
          <Heading size={1} fit caps lineHeight={1} textColor="lava">
            Sailing on Hot Streams
          </Heading>
          <Text margin="30px 0 0" textColor="tertiary" bold>
            Reactive programming in realtime applications
          </Text>
          <Text margin="90px 0 0" textColor="quartenary" bold>
            Tyrone Tudehope
          </Text>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
          <Heading fit caps>
            What is a stream?
          </Heading>
          <Appear>
            <BlockQuote>
              A <Code textColor="secondary" bgColor="primary">sequence</Code> of ongoing
              &nbsp;<Code textColor="secondary" bgColor="primary">events</Code> ordered in time.
              <Cite>Andre Staltz</Cite>
            </BlockQuote>
          </Appear>
          {/* https://gist.github.com/staltz/868e7e9bc2a7b8c1f754 */}
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>Why streams?</li><li>What do streams let us do?</li></ul>"
        >
          <Text margin="30px 0 0" textColor="primary" size={2} bold>
            <Code textColor="secondary" bgColor="primary">React</Code> to
            &nbsp;events <Code textColor="secondary" bgColor="primary">asynchronously</Code>
          </Text>
          <Text margin="30px 0 0" textColor="primary" size={2} bold>
            in a <Code textColor="secondary" bgColor="primary">declarative</Code>
            &nbsp; and <Code textColor="secondary" bgColor="primary">composable</Code>
          </Text>
          <Text margin="30px 0 0" textColor="primary" size={2} bold>
            manner
          </Text>
        </Slide>
        <Slide bgColor="secondary" textColor="primary"
          notes="<ul><li>Start thinking of everything as an event producer</li></ul>"
        >
          <Heading caps>
            The World as Events
          </Heading>
          <List>
            <Appear>
              <ListItem bold>
                User interaction <Code textColor="secondary" bgColor="primary">element.onclick</Code>
              </ListItem>
            </Appear>
            <Appear>
              <ListItem bold>
                Filesystem changes <Code textColor="secondary" bgColor="primary">fs.watch</Code>
              </ListItem>
            </Appear>
            <Appear>
              <ListItem bold>
                Arrays <Code textColor="secondary" bgColor="primary">[1, 2, 3]</Code>
              </ListItem>
            </Appear>
            <Appear>
              <ListItem bold>
                Single value <Code textColor="secondary" bgColor="primary">&#123; foo&#58; 'bar' &#125;</Code>
              </ListItem>
            </Appear>
            <Appear>
              <ListItem bold italic>
                Everything
              </ListItem>
            </Appear>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>Logic to add events onto the stream</li><li>E.g. Add a listener to an `eventemitter`</li><li>Define transformations to apply</li><li>Do something with the data</li></ul>"
        >
          <Heading fit caps>
            How Do We Use Them?
          </Heading>
          <List>
              <Appear>
                <ListItem bold>
                  Define a producer
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Declare steps: <Code textColor="secondary" bgColor="primary">mapReduce</Code>
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Subscribe
                </ListItem>
              </Appear>
          </List>
        </Slide>
        <Slide bgImage={images.frozenRiver.replace("/", "")} bgDarken={0.66}
          notes="<ul><li>Ice thaws</li><li>Water can be observed moving</li><li>Producer created once a subscriber is added</li></ul>"
        >
          <Heading textColor="tertiary">
            Cold Streams
          </Heading>
          <Text margin="30px 0 0" textColor="primary" size={2} bold>
            Shit starts when we say it starts
          </Text>
        </Slide>
        <Slide bgImage={images.lava.replace("/", "")} bgDarken={0.66}
          notes="<ul><li>Lava flowing</li><li>Producer emitting events</li><li>Subscribe to observe</li></ul>"
        >
          <Heading textColor="tertiary">
            Hot Streams
          </Heading>
          <Text margin="30px 0 0" textColor="primary" size={2} bold>
            Shit's going down whether we like it or not
          </Text>
        </Slide>
        <Slide transition={["zoom", "fade"]} bgColor="secondary"
          notes="<ul><li>Deliberately verbose - Might need `arr` for additional calculations</li><li>Takes time to understand</li><li>Logic flow not linear - difficult to follow</li><li>Now also calculate sum of even numbers</li><li>Logic can become exponentially complex</li><li>The `how` becomes difficult to understand</li></ul>"
        >
          <Heading fit caps>
            An Imperative Approach
          </Heading>
          <Layout>
            <Fill>
              <CodePane textSize={20}
                lang="js"
                source={require("raw-loader!../assets/imperative-mapreduce.example")}
                margin="20px auto"
              />
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["zoom", "fade"]} bgColor="secondary"
          notes="<ul><li>Linear flow of logic</li><li>Logic is clear and concise</li><li>We know exactly what we're getting</li><li>Same calculations on prime numbers?</li></ul>"
        >
          <Heading fit caps>
            Let's Try w/ Streams
          </Heading>
          <Layout>
            <Fill>
              <CodePane textSize={20}
                lang="js"
                source={require("raw-loader!../assets/stream-mapreduce.example")}
                margin="20px auto"
              />
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["zoom", "fade"]} bgColor="secondary"
          notes="<ul><li>Encapsulate logic into a single function</li><li>Code is more testable</li><li>Additional calculations can be added with ease</li></ul>"
        >
          <Heading fit caps>
            A Step Further...
          </Heading>
          <Layout>
            <Fill>
              <CodePane textSize={20}
                lang="js"
                source={require("raw-loader!../assets/stream-compose-mapreduce.example")}
                margin="20px auto"
              />
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>Expressive: Write code to declare what something does</li><li>Streams work in exactly the same manner regardless of where used</li><li>Externalized side-effects means decoupled logic</li></ul>"
        >
          <Heading fit caps>
            Fullstack? Yes Please!
          </Heading>
          <List>
              <Appear>
                <ListItem bold>
                  Same paradigms
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Explicit &amp; Predictable
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Testable
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Focus on <Code textColor="secondary" bgColor="primary">what</Code>
                  &nbsp;not <Code textColor="secondary" bgColor="primary">how</Code>
                </ListItem>
              </Appear>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>One input: Events from drivers, one output: Events to drivers</li><li>Side-effects are externalized as drivers</li><li>Linux device drivers: a shared library of privileged, memory resident, low level hardware handling routines</li><li>Pass events to drivers to handle side-effects</li></ul>"
        >
          <Heading fit caps>
            Cycle.js
          </Heading>
          <List>
              <Appear>
                <ListItem bold>
                  Reduce app to a <Code textColor="secondary" bgColor="primary">single pure function</Code>
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Everything is streams
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Drivers
                </ListItem>
              </Appear>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>Operators create a new stream</li><li>Streams can branch off others without affecting them</li><li>No side-effects</li><li>Only concerned with the lava</li></ul>"
        >
          <Heading fit caps>
            XStream
          </Heading>
          <List>
              <Appear>
                <ListItem bold>
                  Immutable
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Pure
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Hot streams only
                </ListItem>
              </Appear>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
          <Heading fit caps>
            Yacht UI
          </Heading>
          <List>
              <Appear>
                <ListItem bold>
                  Monitor instrumentation
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Control the rudder remotely
                </ListItem>
              </Appear>
              <Appear>
                <ListItem bold>
                  Realtime
                </ListItem>
              </Appear>
          </List>
        </Slide>
        <Slide transition={["zoom", "fade"]} bgColor="secondary">
          <Heading fit caps>
            Monitoring instrumentation
          </Heading>
          <Layout>
            <Fill>
              <CodePane textSize={20}
                lang="js"
                source={require("raw-loader!../assets/vdom.example")}
                margin="20px auto"
              />
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["zoom", "fade"]} bgColor="secondary">
          <Heading fit caps>
            Changing Course
          </Heading>
          <Layout>
            <Fill>
              <CodePane textSize={20}
                lang="js"
                source={require("raw-loader!../assets/socketio.example")}
                margin="20px auto"
              />
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary"
          notes="<ul><li>FS as message bus for sensors (interface)</li><li>Server relays sensor updates to Socket.io clients</li><li>Client renders instrumentation changes; steering events, etc</li><li>Updates are tweened by boat `controller`</li><li>Steering only tells boat how far to steer, not where to steer to</li><li>Bug: Have to navigate before we start getting updates</li></ul>"
        >
          <Heading fit caps textColor="lava">
            Demo
          </Heading>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
          <Heading fit caps>
            #AMA
          </Heading>
          <List>
            <ListItem bold>
              Source will be on Github
            </ListItem>
            <ListItem bold>
              Slides too
            </ListItem>
          </List>
        </Slide>
      </Deck>
    );
  }
}
