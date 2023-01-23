/*import ForgeUI, { render, Fragment, Text, IssuePanel } from '@forge/ui';

const App = () => {
  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
); 

import ForgeUI, { render, Fragment, Text, Button, IssuePanel, useState } from '@forge/ui';
import api from '@forge/api';

const App = () => {
    // Get the issue key and summary and description
    const { platformContext: { issueKey }, summary, description } = useProductContext();
    // Set up a state object to hold the generated text
    const [generatedText, setGeneratedText] = useState(null);

    async function generateText() {
        // Call the backend API to generate the long description, acceptance criteria, and notes
        const response = await api.fetch(`/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ summary, description })
        });
        const { longDescription, acceptanceCriteria, notes } = await response.json();
        // Update the state with the generated text
        setGeneratedText({ longDescription, acceptanceCriteria, notes });
    }

    // Render the UI
    return (
        <Fragment>
            <Button text="Generate Story" onClick={generateText} />
            {generatedText && (
                <Fragment>
                    <Text content={`**Long Description:** ${generatedText.longDescription}`} />
                    <Text content={`**Acceptance Criteria:** ${generatedText.acceptanceCriteria}`} />
                    <Text content={`**Notes:** ${generatedText.notes}`} />
                </Fragment>
            )}
        </Fragment>
    );
};

export const run = render(
    <IssuePanel>
        <App />
    </IssuePanel>
);


import ForgeUI, { render, Fragment, Text, Button, IssuePanel, useState } from '@forge/ui';
// import api, {route } from "@forge/api";

const App = () => {
    // Get the issue key and summary and description
    const { platformContext: { issueKey }, summary, description } = useProductContext();
    // Set up a state object to hold the generated text
    const [generatedText, setGeneratedText] = useState(null);
    // Set up a state for loading 
    const [isLoading, setIsLoading] = useState(false);
    
    async function generateText() {
        setIsLoading(true);
        setGeneratedText({ longDescription: "Loading...", acceptanceCriteria: "Loading...", notes: "Loading..." });
        // Call the backend API to generate the long description, acceptance criteria, and notes
        const response = await api.fetch(`/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ summary, description })
        });
        const { longDescription, acceptanceCriteria, notes } = await response.json();
        // Update the state with the generated text
        setGeneratedText({ longDescription, acceptanceCriteria, notes });
        setIsLoading(false);
    }

    // Render the UI
    return (
        <Fragment>
            <Button text="Generate Story" onClick={generateText} />
            {isLoading ? (
                <Fragment>
                    <Text content={`**Long Description:** ${generatedText.longDescription}`} />
                    <Text content={`**Acceptance Criteria:** ${generatedText.acceptanceCriteria}} /> <Text content={Notes: ${generatedText.notes}`} />
</Fragment>
) : (
<Text content="Press the Generate Story button to generate the text."/>
)}
</Fragment>
);
};

export const run = render(
<IssuePanel>
<App />
</IssuePanel>
);
*/

import ForgeUI, { render, Fragment, Text, Button, useState } from '@forge/ui';
import { useIssueContext } from "@forge/ui-jira";
import api from '@forge/api';
import { IssuePanel } from "@forge/ui-jira";

const App = () => {
  // Get the issue key and summary and description
  const { issueKey, summary, description } = useIssueContext();
  // Set up a state object to hold the generated text
  const [generatedText, setGeneratedText] = useState(null);
  // Set up a state for loading 
  const [isLoading, setIsLoading] = useState(false);

  async function generateText() {
    setIsLoading(true);
    setGeneratedText({ longDescription: "Loading...", acceptanceCriteria: "Loading...", notes: "Loading..." });
    // Call the backend API to generate the long description, acceptance criteria, and notes
    try {
      const response = await api.fetch(`/api/generate`, {
        method: 'POST',
        body: JSON.stringify({ summary, description })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      // Update the state with the generated text
      setGeneratedText({ longDescription: json.longDescription, acceptanceCriteria: json.acceptanceCriteria, notes: json.notes });
    } catch (error) {
      setGeneratedText({ longDescription: "API under development", acceptanceCriteria: "API under development", notes: "API under development" });
    }
    setIsLoading(false);
  }

    // Render the UI
return (
  <Fragment>
    <Button text="Generate Story" onClick={generateText} />
    {isLoading ? (
    generatedText ? (
        <Fragment>
            {Object.entries(generatedText).map(([key, value]) => (
                <Text content={`**${key.replace(/([A-Z])/g, ' $1').trim()}:** ${value}`} />
            ))}
        </Fragment>
    ) : (
        <Text content="Loading..."/>
    )
) : (
    <Text content="Press the Generate Story button to generate the text."/>
)}
  </Fragment>
);
};

export const run = render(() => {
  try {
      return (
        <IssuePanel>
        <Fragment>
          <App />
        </Fragment>
      </IssuePanel>
      )
  } catch (error) {
      // handle error here
  }
});



/*{isLoading ? <Text content="Loading..." /> : generatedText ? (
  <Fragment>
    <Text content={`**Long Description:** ${generatedText.longDescription}`} />
    <Text content={`**Acceptance Criteria:** ${generatedText.acceptanceCriteria}`} />
    <Text content={`**Notes:** ${generatedText.notes}`} />
  </Fragment>*/

 /* import ForgeUI, { render, Fragment, Text, Button, ButtonSet, IssuePanel, useState, useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";

// API docs: https://docs.microsoft.com/en-au/azure/cognitive-services/translator/reference/v3-0-translate
const TRANSLATE_API = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

// See children of the 'dictionary' property from the response from the 
// following URL for valid language codes:
//
//   https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
//
// LANGUAGES is an Array of ['Button text', 'Language code']. 
const LANGUAGES = [
  ['🇯🇵 日本語', 'ja'], 
  ['🇰🇷 한국어', 'ko'], 
  ['🇬🇧 English', 'en'],
];

const App = () => {
  // Get the context issue key
  const { platformContext: { issueKey } } = useProductContext();
  // Set up a state object to hold translations
  const [translation, setTranslation] = useState(null);  
  
  async function setLanguage(countryCode) {
    // Fetch issue fields to translate from Jira
    const issueResponse = await api.asApp().requestJira(route`/rest/api/2/issue/${issueKey}?fields=summary,description`);
    await checkResponse('Jira API', issueResponse);
    const { summary, description } = (await issueResponse.json()).fields;

    // Translate the fields using the Azure Cognitive Services Translatioon API
    const translateResponse = await api.fetch(`${TRANSLATE_API}&to=${countryCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        // See README.md for details on generating a Translation API key
        'Ocp-Apim-Subscription-Key': process.env.TRANSLATE_API_KEY,
        'Ocp-Apim-Subscription-Region': process.env.TRANSLATE_API_LOCATION
      },
      body: JSON.stringify([{Text:summary}, {Text:description || 'No description'}])
    });
    await checkResponse('Translate API', translateResponse);
    const [summaryTranslation, descriptionTranslation] = await translateResponse.json();

    // Update the UI with the translations
    setTranslation({
      to: countryCode,
      summary: summaryTranslation.translations[0].text,
      description: descriptionTranslation.translations[0].text
    });
  }

  // Render the UI
  return (
    <Fragment>
      <ButtonSet>
        {LANGUAGES.map(([label, code]) => 
          <Button 
            text={label} 
            onClick={async () => { await setLanguage(code); }} 
          />
        )}
      </ButtonSet>
      {translation && (        
        <Fragment>
          <Text content={`**${translation.summary}**`} />
          <Text content={translation.description} />
        </Fragment>
      )}
    </Fragment>
  );
};

/**
 * Checks if a response was successful, and log and throw an error if not. 
 * Also logs the response body if the DEBUG_LOGGING env variable is set.
 * @param apiName a human readable name for the API that returned the response object
 * @param response a response object returned from `api.fetch()`, `requestJira()`, or similar
 
async function checkResponse(apiName, response) {
  if (!response.ok) {
    const message = `Error from ${apiName}: ${response.status} ${await response.text()}`;
    console.error(message);
    throw new Error(message);
  } else if (process.env.DEBUG_LOGGING) {
    console.debug(`Response from ${apiName}: ${await response.text()}`);
  }
}

export const run = render(
<IssuePanel>
  <App />
</IssuePanel>
  ); */