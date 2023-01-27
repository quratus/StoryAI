import ForgeUI, { render, Fragment, Text, Button, IssuePanel, useState, useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";

const App = () => {
const { platformContext: { issueKey } } = useProductContext();
const [generatedText, setGeneratedText] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function generateText() {
  setIsLoading(true);
  const issueResponse = await api.asApp().requestJira(`https://quratus.atlassian.net/rest/api/3/issue/${issueKey}?fields=summary,description`);
  const { summary, description } = (await issueResponse.json()).fields;

  // send the summary and description to the backend
  const backendResponse = await api.fetch(`/generate-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary, description })
  });
  const { generatedText } = await backendResponse.json();

  setGeneratedText(generatedText);
  setIsLoading(false);
}

return (
<Fragment>
<Button text="Generate Story" onClick={generateText} />
{isLoading && <Text content="Loading..." />}

{generatedText && <Text content={generatedText} />}
</Fragment>
);
};

export const run = render(
<IssuePanel>
<App />
</IssuePanel>
);

