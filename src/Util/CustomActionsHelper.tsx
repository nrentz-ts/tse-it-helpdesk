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

// Function to detect and format date/time values intelligently
export function formatDateValue(value: any, attributeName?: string): string {
  try {
    // Handle different value formats from ThoughtSpot
    let epochValue: number | null = null;
    
    if (typeof value === 'number') {
      epochValue = value;
    } else if (value && typeof value === 'object' && value.v && value.v.s) {
      epochValue = value.v.s;
    } else if (value && typeof value === 'string') {
      // Try to parse as number
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        epochValue = parsed;
      }
    }
    
    // If we have an epoch value, format it intelligently
    if (epochValue !== null) {
      // Additional validation: epoch values should be reasonable (not too small or too large)
      // Typical epoch range: 1970-2038 (0 to ~2.1 billion seconds)
      if (epochValue < 0 || epochValue > 2147483647) {
        return value.toString();
      }
      
      const date = new Date(epochValue * 1000);
      
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        return value.toString();
      }
      
      // Additional check: if the date is before 1970 or after 2038, it's probably not a real epoch
      const year = date.getFullYear();
      if (year < 1970 || year > 2038) {
        return value.toString();
      }
      
      // Determine format based on attribute name patterns
      const attrName = attributeName?.toLowerCase() || '';
      
      // Monthly data (like "Aug 2025")
      if (attrName.includes('month') || attrName.includes('monthly')) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric',
          timeZone: 'UTC'
        });
      }
      
      // Yearly data
      if (attrName.includes('year') || attrName.includes('yearly')) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric',
          timeZone: 'UTC'
        });
      }
      
      // Daily data
      if (attrName.includes('day') || attrName.includes('daily') || attrName.includes('date')) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          timeZone: 'UTC'
        });
      }
      
      // Hourly or time-based data
      if (attrName.includes('hour') || attrName.includes('time') || attrName.includes('hourly')) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        });
      }
      
      // Default: try to detect the granularity from the timestamp
      // If the time component is 00:00:00, it's likely daily or monthly data
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();
      
      if (hours === 0 && minutes === 0 && seconds === 0) {
        // Check if it's the first day of the month (monthly data)
        if (date.getUTCDate() === 1) {
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric',
            timeZone: 'UTC'
          });
        } else {
          // Daily data
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC'
          });
        }
      } else {
        // Has time component, show datetime
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        });
      }
    }
    
    // Not a date, return as-is
    return value.toString();
    
  } catch (error) {
    console.error('Error formatting date value:', error);
    return value.toString();
  }
}

// Function to extract data from the ThoughtSpot payload (used by both JIRA and ServiceNow)
export function extractDataFromPayload(payload: any) {
  try {
    let attributeValue: string | null = null;
    let attributeName: string | null = null;
    let measureValue: number | null = null;
    let measureName: string | null = null;
    let visualizationName: string | null = null;
    
    // Extract visualization name from embedAnswerData.name
    if (payload.embedAnswerData && payload.embedAnswerData.name) {
      visualizationName = payload.embedAnswerData.name;
    }
    
    // Extract attribute value and name from selectedPoints
    if (payload.contextMenuPoints && 
        payload.contextMenuPoints.selectedPoints && 
        payload.contextMenuPoints.selectedPoints[0] &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes &&
        payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0]) {
      
      const selectedAttribute = payload.contextMenuPoints.selectedPoints[0].selectedAttributes[0];
      
      // Extract attribute value
      if (selectedAttribute.value) {
        attributeValue = selectedAttribute.value;
      }
      
      // Extract attribute name for smart date formatting
      if (selectedAttribute.column && selectedAttribute.column.name) {
        attributeName = selectedAttribute.column.name;
      }
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
    
    // Format the attribute value intelligently (handles date/time formatting)
    const formattedAttributeValue = attributeValue ? formatDateValue(attributeValue, attributeName || undefined) : 'Unknown';
    
    const extractedData = {
      attributeValue: attributeValue,
      formattedAttributeValue: formattedAttributeValue,
      attributeName: attributeName,
      measureValue: measureValue,
      formattedMeasureValue: formattedMeasureValue,
      measureName: measureName,
      visualizationName: visualizationName,
      source: 'Nex AI Analysis'
    };
    
    return extractedData;
    
  } catch (error) {
    console.error('Error extracting data from payload:', error);
    return null;
  }
}

// Function to extract JIRA ticket data from the ThoughtSpot payload
export function extractJiraDataFromPayload(payload: any) {
  const extractedData = extractDataFromPayload(payload);
  if (!extractedData) return null;
  
  // Create summary and description for JIRA
  const summary = `Data Analysis Issue: ${extractedData.formattedAttributeValue} ${extractedData.measureName || 'data'}`;
  const description = `Visualization: ${extractedData.visualizationName || 'Not available'}\nAttribute: ${extractedData.formattedAttributeValue}\nMeasure: ${extractedData.formattedMeasureValue} (${extractedData.measureName || 'Not available'})\nPlease investigate this data point for deeper analysis.`;
  
  return {
    summary: summary,
    description: description,
    ...extractedData
  };
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

// Function to extract ServiceNow incident data from the ThoughtSpot payload
export function extractServiceNowDataFromPayload(payload: any) {
  const extractedData = extractDataFromPayload(payload);
  if (!extractedData) return null;
  
  // Create ServiceNow incident data
  const shortDescription = `Data Analysis Issue: ${extractedData.formattedAttributeValue} ${extractedData.measureName || 'data'}`;
  const description = `Visualization: ${extractedData.visualizationName || 'Not available'}\nAttribute: ${extractedData.formattedAttributeValue}\nMeasure: ${extractedData.formattedMeasureValue} (${extractedData.measureName || 'Not available'})\nPlease investigate this data point for deeper analysis.\n\nSource: Nex AI Analysis`;
  
  return {
    short_description: shortDescription,
    description: description,
    category: 'Software',
    priority: '2',
    urgency: '2',
    impact: '2',
    ...extractedData
  };
}

// Function to open ServiceNow incident creation page in a new tab
export function openServiceNowIncidentCreation(serviceNowData: any) {
  try {
    // Clean and encode the ServiceNow data
    const cleanShortDescription = serviceNowData.short_description.toString().trim();
    const cleanDescription = serviceNowData.description.toString().trim();
    
    // Validate that we have ServiceNow content
    if (!cleanShortDescription || cleanShortDescription === '{}' || cleanShortDescription === 'null') {
      alert('No data found to create ServiceNow incident. Please try clicking on a data point first.');
      return;
    }
    
    // Encode the data for URL parameters
    const encodedShortDescription = encodeURIComponent(cleanShortDescription);
    const encodedDescription = encodeURIComponent(cleanDescription);
    const encodedCategory = encodeURIComponent(serviceNowData.category || 'Software');
    const encodedPriority = encodeURIComponent(serviceNowData.priority || '2');
    const encodedUrgency = encodeURIComponent(serviceNowData.urgency || '2');
    const encodedImpact = encodeURIComponent(serviceNowData.impact || '2');
    
    // Construct ServiceNow incident creation URL
    const serviceNowBaseUrl = 'https://dev187185.service-now.com';
    
    // Create URL with pre-filled incident form parameters using the correct SOW format
    // Format: /now/sow/record/incident/-1_uid_1/params/query/[field1=value1^field2=value2]
    const queryParams = [
      `short_description=${cleanShortDescription}`,
      `description=${cleanDescription}`,
      `category=${serviceNowData.category || 'Software'}`,
      `priority=${serviceNowData.priority || '2'}`,
      `urgency=${serviceNowData.urgency || '2'}`,
      `impact=${serviceNowData.impact || '2'}`
    ].join('^');
    
    const serviceNowCreateUrl = `${serviceNowBaseUrl}/now/sow/record/incident/-1_uid_1/params/query/${encodeURIComponent(queryParams)}`;
    
    // Open in new tab
    window.open(serviceNowCreateUrl, '_blank', 'noopener,noreferrer');
    
  } catch (error) {
    console.error('Error opening ServiceNow incident creation:', error);
    alert('Error opening ServiceNow incident creation. Please check the console for details.');
  }
}
