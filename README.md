## Overview

This node.js script is meant to aid developers in migrating their data from a Wordpress site to Sanity.io via the WP REST API. It is based on the work done by @kmelve on the [wordpress-to-sanity](https://github.com/kmelve/wordpress-to-sanity) XML migration script.

Note: I am not an expert on Sanity.io, in fact I wrote this script to allow me to try Sanity.io for the first time. That being the case, please reach out to the [Sanity.io Slack Community](https://slack.sanity.io/) for support on all things Sanity related. For Wordpress support I would check out the official [Wordpress support forums](https://wordpress.org/support/forums/).

## Install

First, install all required dependencies:

```bash
npm install
# or
yarn install
```

Make sure you have a Wordpress install with the REST API enabled and accessible. If you want to include custom post types, make sure you enable them in the REST API when you register the post type:

```php
register_post_type('custom', array(
  ...
  'show_in_rest' => true,
  ...
));
```

If you use ACF, you can include those fields with the [ACF to REST API plugin](https://wordpress.org/plugins/acf-to-rest-api/).

You must also have a Sanity.io project created where you can import the data.

## Usage

### Configuration

The script isn't entirely hands off, since it's up to you to decide how to model the data you get from Wordpress into Sanity. There are two things you need to do to get started:

- Create a `.env` file at the root of this project which includes values you will need to run this script.
- Create/edit the files found in the `/api/` and `/serializers` directories to define which WP endpoints we're working with, how we'll fetch the data, and how we'll serialize it into Sanity.

#### .env

Create a `.env` file at the root of your project. This will contain variables that are used by the script to function.

First, add the WP API url that you will be migrating:

```conf
WP_API_ENDPOINT=https://<YOUR WP SITE DOMAIN>.com/wp-json/wp/v2
```

Optionally, we can add variables to configure the sanity js client, which may optionally be used to import data or delete collections of data using the `/utils/delete-collection.js` script. The two keys we need are:

```conf
SANITY_API_TOKEN=<YOUR SANITY API TOKEN>
SANITY_PROJECT_ID=<YOUR SANITY PROJECT ID>
```

#### API Endpoints (`/api`)

Each file in the `/api` directory maps to an endpoint from your WP REST API. For example, if you want to import your posts from WP to Sanity, you should create a `/api/post.js` file.

In each file you will decide how to request data and what to do with the response. Typically this means requesting data from a WP API endpoint, running it through a serializer function to convert it to a format that will work with sanity and returning the result.

Take a look at the `api/post/js` for an example of stitching together different records to create a single document in Sanity.

#### Serializers (`/serializers`)

Each of these files should export a serializer function which will take the data from a WP API response and format it to the however you want to model the data in your Sanity project.

I have included a few examples, but feel free to modify/add/delete them as you wish.

### Generate Sanity Import Data

By default this script is set up to log serialized results to the console. That means if you simply run `node index.js` or `yarn start` you will see the serialized output in your terminal, but it won't be saved anywhere. If you want to generate a file that can be imported to Sanity, run `yarn output` or `node index.js > output.ndjson`.

### Import Data to Sanity Project

Now that you have a `output.ndjson` import file, you can import it using the Sanity CLI. First, you'll need to `cd` to the directory of your sanity project. The CLI won't let you import a dataset from outside the context of a project.

Next, use the Sanity CLI to import your dataset. I highly recommend reading the [Sanity CLI docs](https://www.sanity.io/docs/cli) before you attempt anything. If you're starting from scratch or don't care about possibly losing data, you can run the following command to import your data to your project (THIS WILL OVERWRITE ANY EXISTING DATA IN YOUR PROJECT!):

```bash
DEBUG=sanity* sanity dataset import /path/to/your/import/file/output.ndjson production --replace  --allow-failing-assets
```

The optional `DEBUG=sanity*` will just log debug lines to your terminal while the action is performed. The `--allow-failing-assets` will complete the import even if you have missing images.

If all went well, you should be able to load your Sanity project and see your migrated WP data (assuming you've created schemas for the documents, but that's outside the scope of this repo).

### Rinse & Repeat

If you decide you want to make tweaks to your data modeling and want to re-import it all again, sometimes it is helpful to blow away any old data that you have. Usually, the `--replace` flag when running the `sanity dataset import` command is good enough, but sometimes you need to go nuclear.

I included a script in `utils/delete-collection.js` which will delete all records of a given document type in Sanity. It uses the sanity JS client to achieve this result, rather than the CLI, so you must provide credentials in your `.env` file. To use it, just call it and pass the name of the document type that has the records you wish to delete:

```bash
node utils/delete-collection.js post # where "post" is the document name
```

## Contribute back

I hope this script was helpful to you. If you have ideas on how to improve it, please submit a PR! Don't know how to contribute but have an idea? Open an issue and I'll take a look. I don't have big ambitions for this project, but it helped me get unblocked in my migration so I thought I'd at least make it open-source so you may benefit as well.
