# TSE Demo Builder

The TSE Demo Builder allows you to easily create demos for customers using either sample content or pre-built content.  

## Running from Vercel

The easiest way to use [TSE Demo Builder](https://ts-demo-builder-six.vercel.app) is to use the hosted version.  Then use the settings to pick either a pre-defined configuration or add your own.

## Installing and running locally

<details>
<summary>Installation Steps</summary>
To install locally you can either install using the Git command line (recommended) or downloading the files.

### Download files

#### Download with GIT

To install using `git` open Terminal or PowerShell and navigate to a folder where you want to install the demo builder.  Note that the demo builder will be installed into a child folder.

Now run the following command: `git clone https://github.com/thoughtspot/ts-demo-builder.git`

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