import ForgeUI, { render, Fragment, Text, Button, IssuePanel, useState, useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";

const App = () => {
const { platformContext: { issueKey } } = useProductContext();
const [generatedText, setGeneratedText] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function generateText() {
  setIsLoading(true);
  const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=summary,description`);

  const responseJson = await issueResponse.json();

  if (!responseJson || !responseJson.fields || !responseJson.fields.summary || !responseJson.fields.description) {
    console.error(`Error: The response from the Jira API does not contain the expected fields. Response JSON: ${JSON.stringify(responseJson)}`);
    responseJson = { fields: { summary: 'Create a Hello World Jira plugin', description: 'As developer, I want to create a hello world plugin for jira, using @forge/ui Library' }};
   }

const { summary, description } = responseJson.fields;

console.log(`Sending fields: summary: "${summary}", description: "${description}"`);

  // send the summary and description to the backend
  const backendResponse = await api.fetch(`http://localhost:3000/generate-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary, description })  
  });
  
  if (backendResponse.ok) {
    console.log("backendResponse ran successfully");
  } else {
    console.error(`backendResponse failed with status code: ${backendResponse.status}`);
  }
  
  const { generatedText } = await backendResponse.json();


  setGeneratedText(generatedText);
  setIsLoading(false);
}


return (
  <Fragment>
    <Button text="Generate Story" onClick={generateText} />
    {isLoading && <Text content="Loading..." />}
    {generatedText && <Text content={generatedText} />}
    {generatedText && <Text content={`Sent fields: summary: "${summary}", description: "${description}"`} />}
  </Fragment>
);
};

export const run = render(
<IssuePanel>
<App />
</IssuePanel>
);

