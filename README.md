# TSE Demo Builder

This TSE demo builder is built off of the original [TSE Demo builder Github repo](https://github.com/thoughtspot/ts-demo-builder).

## Running from Vercel

The easiest way to use this demo is to run them directly from Vercel. You can access the same repo from three addresses currently - so you can showcase multiple apps branded differently to fit each core app's design language.
* [Metric Pulse](https://metricpulse.vercel.app/)
* [Nexora](nexora-webapp.vercel.app)
* [Telvanta](https://telvanta.vercel.app/)

You can then load the appropriate pre-built configuration for each app.

## Key changes made to this app when compared to the legacy TSE Demo builder
<details>
<summary>Branding, feature, and style changes detailed log</summary>
### Branding
* Built a non-changeable home page simulating a marketing application. This home page dynamically picks up the user name in the app, and follows the app's main theme colors.
* The app take a portion of the app's icon to create a favicon on the Browser
* The app takes the app's name as the name of the tab in your browser

### Features
#### Spotter Embed
* The Spotter embed page fully follows the app's theme to look blended into the core app
* SpotterEmbed now shows working custom actions - note that many custom actions are hardcoded to be hidden directly from Spotter embed to avoid a large dropdown of strangely named custom actions.

#### Pre-built styles
* Can now inject CSS variables, logo, and string replacements right in the pre-built styles.
* Created three pre-built styles that fit the pre-built demo apps, and removed the other default styles from the legacy demo
</details>

## Installing and running locally

<details>
<summary>Installation Steps</summary>
To install locally you can either install using the Git command line (recommended) or downloading the files.

### Download files

#### Download with GIT

To install using `git` open Terminal or PowerShell and navigate to a folder where you want to install the demo builder.  Note that the demo builder will be installed into a child folder.

Now run the following command: `git clone https://github.com/nrentz-ts/ts-demo-builder-sept10.git`

You should see files download and then get a success message.

#### Download via ZIP file

Alternatively you can just download using the code button and selecting `Download ZIP`.  This will download a zip file.  Put the file into the folder where you want it and double click to extract the files.

### Installing dependencies

You should now have folder named either ts-demo-builder or ts-demo-builder-main.  `cd` into the folder.  

Run the following command: `npm install`

You should see dependencies getting installed.  You may see warning about dependencies or deprecations, but you can ignore those (usually).

### Create a .env file

To demo DAG capabilities, you need to create a .env file in the root directory and add the following:

`REACT_APP_GPT_API_KEY=<your key>`, where `<your key>` is a valid OpenAI key.  

### Starting the demo code

To start the server, from the root folder run `npm start`.  You will see messages, but then you should see a browser open to `http://localhost:3000`.
</details>