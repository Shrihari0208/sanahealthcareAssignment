Script Assist- React Developer Technical
Exercise
Pre-requisite
Along with this specification you should have received a ZIP folder containing a starter codebase for
the exercise. This set up includes:
• React / React DOM
• React Router
• Mantine UI
• React Query
• Zustand
Task
There are five success criteria for the exercise, each should be combined into the codebase provided
and work together as a single integrated solution:
Find a public API you can use to consume endpoints such as SWAPI - The Star Wars API or SpaceXAPI/docs at master · r-spacex/SpaceX-API (github.com) but feel free to use your own.
Authentication Mechanism
Implement an authentication method which validates a login request and switches from public to
private pages to demonstrate authenticated access. Ideally the auth state is persisted between
sessions (client-side persistence).
Resource List Page
Build a page that queries the API for a list of resources and displays them in some sort of tabular
format, bonus for forms of searching, filtering, sorting, querying etc.
Resource Detail Page (enrich)
Build a page that queries the API for a singular resource and displays the information in a detail page
using multiple components from Mantine to display knowledge of the framework.
Data Enrichment
Take the resource detail page from above and expand the functionality to make a subsequent API call
which enriches the resource with additional information and displays it in the detail page
Deep linking
Expand the routes/pages to take path or query parameters that streamline the interaction of the
page in some manner.
