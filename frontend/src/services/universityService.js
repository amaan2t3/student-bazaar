const UNIVERSITIES_API_URL = 'https://universities.hipolabs.com/search?country=Pakistan';
const UNIVERSITY_DATASET_URL = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';

const getNames = (universities) => [...new Set(
  universities
    .map((university) => university.name?.trim())
    .filter(Boolean)
)].sort((a, b) => a.localeCompare(b));

export const getPakistaniUniversities = async (signal) => {
  let response;
  try {
    response = await fetch(UNIVERSITIES_API_URL, { signal });
    if (!response.ok) {
      throw new Error(`University directory request failed (${response.status}).`);
    }

    const universities = await response.json();
    if (!Array.isArray(universities)) {
      throw new Error('University directory returned an invalid response.');
    }

    const names = getNames(universities);
    if (names.length > 0) return names;
  } catch (error) {
    if (signal?.aborted) throw error;
  }

  response = await fetch(UNIVERSITY_DATASET_URL, { signal });
  if (!response.ok) {
    throw new Error(`University dataset request failed (${response.status}).`);
  }

  const universities = await response.json();
  if (!Array.isArray(universities)) {
    throw new Error('University dataset returned an invalid response.');
  }

  const names = getNames(universities.filter(
    (university) => university.country === 'Pakistan' || university.alpha_two_code === 'PK'
  ));
  if (names.length === 0) {
    throw new Error('University dataset returned no Pakistani universities.');
  }

  return names;
};

export default { getPakistaniUniversities };
