/**
 * Custom Action Functions for ThoughtSpot Embeds
 * 
 * This file contains utility functions that support code-based custom actions
 * in the ThoughtSpot Visual Embed SDK. These functions are separated from the 
 * main components to improve code organization and maintainability.
 * 
 * FUNCTION CATEGORIES:
 * 
 * 1. Data Extraction & Processing:
 *    - extractSearchDataFromPayload: Parses ThoughtSpot event payloads for search data
 *    - extractJiraDataFromPayload: Extracts structured data for JIRA ticket creation
 *    - parseCurrentPath: Extracts liveboard and tab IDs from URL paths
 *    - formatNumber: Formats large numbers with K/M/B suffixes (e.g., 15.56M)
 * 
 * 2. External Integrations:
 *    - openGoogleSearch: Opens Google search with data from ThoughtSpot visualizations
 *    - openJiraTicketCreation: Creates JIRA tickets pre-filled with ThoughtSpot data
 * 
 * USAGE:
 * These functions are imported in ThoughtSpotObjectView and called in response to:
 * - ThoughtSpot EmbedEvent.CustomAction events
 * - Data processing needs for external integrations
 */

// Function to parse currentPath and extract liveboardID and tabId
export function parseCurrentPath(currentPath: string) {
  console.log('🔍 Parsing currentPath:', currentPath);
  
  // Pattern: "/embed/insights/viz/{liveboardID}/tab/{tabId}"
  const pathMatch = currentPath.match(/\/embed\/insights\/viz\/([^\/]+)\/tab\/([^\/]+)/);
  
  if (pathMatch && pathMatch.length >= 3) {
    const liveboardId = pathMatch[1];
    const tabId = pathMatch[2];
    console.log('🎯 Extracted from path - LiveboardID:', liveboardId, 'TabID:', tabId);
    return { liveboardId, tabId };
  } else {
    console.warn('⚠️ Could not parse currentPath:', currentPath);
    return { liveboardId: null, tabId: null };
  }
}

// Function to extract searchable data from the ThoughtSpot payload
export function extractSearchDataFromPayload(payload: any) {
  try {
    // Target the specific path: contextMenuPoints.selectedPoints.0.selectedAttributes.0.value
    if (payload.contextMenuPoints && 
        payload.contextMenuPoints.selectedPoints && 
        payload.contextMenuPoints.selectedPoints[0] &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0] &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0].value) {
      
      const selectedValue = payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0].value;
      return selectedValue.toString();
    }
    
    // Fallback: try to find any value in the payload structure
    if (payload.value) {
      return payload.value.toString();
    }
    
    return null;
    
  } catch (error) {
    console.error('Error extracting search data:', error);
    return null;
  }
}

// Function to open Google search in a new tab
export function openGoogleSearch(searchData: string) {
  try {
    // Clean and encode the search data
    const cleanSearchData = searchData.toString().trim();
    
    // Validate that we have searchable content
    if (!cleanSearchData || cleanSearchData === '{}' || cleanSearchData === 'null') {
      alert('No searchable data found. Please try clicking on a data point first.');
      return;
    }
    
    // Just search for the clean data - no extra context needed
    const encodedSearch = encodeURIComponent(cleanSearchData);
    
    // Construct Google search URL
    const googleSearchUrl = `https://www.google.com/search?q=${encodedSearch}`;
    
    // Open in new tab
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    
  } catch (error) {
    console.error('Error opening Google search:', error);
    alert('Error opening Google search. Please check the console for details.');
  }
}

// Function to format numbers for readability (e.g., 15564795 -> 15.56M)
export function formatNumber(num: number | string): string {
  if (typeof num !== 'number') {
    num = parseFloat(num.toString());
  }
  
  if (isNaN(num)) return num.toString();
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
}

// Function to extract JIRA ticket data from the ThoughtSpot payload
export function extractJiraDataFromPayload(payload: any) {
  try {
    let attributeValue: string | null = null;
    let measureValue: number | null = null;
    let measureName: string | null = null;
    let visualizationName: string | null = null;
    
    // Extract visualization name from embedAnswerData.name
    if (payload.embedAnswerData && payload.embedAnswerData.name) {
      visualizationName = payload.embedAnswerData.name;
    }
    
    // Extract attribute value from selectedPoints
    if (payload.contextMenuPoints && 
        payload.contextMenuPoints.selectedPoints && 
        payload.contextMenuPoints.selectedPoints[0] &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0] &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0].value) {
      
      attributeValue = payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0].value;
    }
    
    // Extract measure value and name from clickedPoint.selectedMeasures
    if (payload.contextMenuPoints && 
        payload.contextMenuPoints.clickedPoint &&
        payload.contextMenuPoints.clickedPoint.selectedMeasures &&
        payload.contextMenuPoints.clickedPoint.selectedMeasures[0]) {
      
      const measure = payload.contextMenuPoints.clickedPoint.selectedMeasures[0];
      
      // Extract measure value
      if (measure.value !== undefined) {
        measureValue = measure.value;
      }
      
      // Extract measure name
      if (measure.column && measure.column.name) {
        measureName = measure.column.name;
      }
    }
    
    // Try alternative paths for measure data
    if (!measureValue && payload.contextMenuPoints && 
        payload.contextMenuPoints.clickedPoint) {
      
      const clickedPoint = payload.contextMenuPoints.clickedPoint;
      
      // Try different possible paths
      if (clickedPoint.value !== undefined) {
        measureValue = clickedPoint.value;
      }
      
      if (clickedPoint.selectedMeasures && clickedPoint.selectedMeasures[0]) {
        const altMeasure = clickedPoint.selectedMeasures[0];
        if (altMeasure.value !== undefined) {
          measureValue = altMeasure.value;
        }
        if (altMeasure.name) {
          measureName = altMeasure.name;
        }
      }
    }
    
    // Fallback: try to find any value in the payload structure
    if (!attributeValue && payload.value) {
      attributeValue = payload.value;
    }
    
    // Format the measure value for readability
    const formattedMeasureValue = measureValue ? formatNumber(measureValue) : 'Not available';
    
    // Create summary and description
    const summary = `Data Analysis Issue: ${attributeValue || 'Unknown'} ${measureName || 'data'}`;
    const description = `Visualization: ${visualizationName || 'Not available'}\nAttribute: ${attributeValue || 'Not available'}\nMeasure: ${formattedMeasureValue} (${measureName || 'Not available'})\nPlease investigate this data point for deeper analysis.`;
    
    const jiraData = {
      summary: summary,
      description: description,
      attributeValue: attributeValue,
      measureValue: measureValue,
      formattedMeasureValue: formattedMeasureValue,
      measureName: measureName,
      visualizationName: visualizationName,
      source: 'ThoughtSpot Analysis'
    };
    
    return jiraData;
    
  } catch (error) {
    console.error('Error extracting JIRA data:', error);
    return null;
  }
}

// Function to open JIRA ticket creation page in a new tab
export function openJiraTicketCreation(jiraData: any) {
  try {
    // Clean and encode the JIRA data
    const cleanSummary = jiraData.summary.toString().trim();
    const cleanDescription = jiraData.description.toString().trim();
    
    // Validate that we have JIRA content
    if (!cleanSummary || cleanSummary === '{}' || cleanSummary === 'null') {
      alert('No data found to create JIRA ticket. Please try clicking on a data point first.');
      return;
    }
    
    // Encode the data for URL parameters
    const encodedSummary = encodeURIComponent(cleanSummary);
    const encodedDescription = encodeURIComponent(cleanDescription);
    
    // Construct JIRA ticket creation URL
    const jiraBaseUrl = 'https://thoughtspot.atlassian.net';
    
    // Include both summary and description
    const jiraCreateUrl = `${jiraBaseUrl}/secure/CreateIssueDetails!init.jspa?pid=10400&issuetype=10300&summary=${encodedSummary}&description=${encodedDescription}`;
    
    // Open in new tab
    window.open(jiraCreateUrl, '_blank', 'noopener,noreferrer');
    
  } catch (error) {
    console.error('Error opening JIRA ticket creation:', error);
    alert('Error opening JIRA ticket creation. Please check the console for details.');
  }
}
