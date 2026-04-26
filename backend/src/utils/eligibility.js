function normalizeGPA(gpa, scale, targetScale = 4.0) {
  if (!gpa || !scale) return 0;
  return (gpa / scale) * targetScale;
}

function checkAcademicEligibility(profile, criteria) {
  const reasons = [];
  let eligible = true;

  const degreeRank = { high_school: 1, bachelors: 2, masters: 3, phd: 4 };
  const userDegree = profile.academicBackground?.highestDegree || '';
  const requiredDegree = criteria.academic?.minimumDegree || 'high_school';

  if ((degreeRank[userDegree] || 0) < (degreeRank[requiredDegree] || 0)) {
    eligible = false;
    reasons.push(
      `Minimum degree required: ${requiredDegree.replace('_', ' ')}. You have: ${userDegree.replace('_', ' ') || 'not specified'}.`
    );
  }

  if (criteria.academic?.minimumGPA) {
    const normalizedGPA = normalizeGPA(
      profile.academicBackground?.gpa,
      profile.academicBackground?.gpaScale || 4.0,
      criteria.academic.gpaScale || 4.0
    );
    if (normalizedGPA < criteria.academic.minimumGPA) {
      eligible = false;
      reasons.push(
        `Minimum GPA required: ${criteria.academic.minimumGPA}/${criteria.academic.gpaScale || 4.0}. Your normalized GPA: ${normalizedGPA.toFixed(2)}.`
      );
    }
  }

  return { eligible, reasons };
}

function checkLanguageEligibility(profile, criteria) {
  const reasons = [];
  let eligible = true;

  if (criteria.language?.englishRequired) {
    const testType = profile.englishProficiency?.testType;
    const score = profile.englishProficiency?.score;

    if (!testType || testType === 'none' || testType === '') {
      eligible = false;
      reasons.push('English proficiency test is required. Please provide IELTS/TOEFL or equivalent score.');
    } else if (testType === 'ielts' && criteria.language.minimumIELTS) {
      if (!score || score < criteria.language.minimumIELTS) {
        eligible = false;
        reasons.push(
          `Minimum IELTS score required: ${criteria.language.minimumIELTS}. Your score: ${score || 'not provided'}.`
        );
      }
    } else if (testType === 'toefl' && criteria.language.minimumTOEFL) {
      if (!score || score < criteria.language.minimumTOEFL) {
        eligible = false;
        reasons.push(
          `Minimum TOEFL score required: ${criteria.language.minimumTOEFL}. Your score: ${score || 'not provided'}.`
        );
      }
    }
  }

  if (criteria.language?.localLanguageRequired) {
    reasons.push(
      `Note: ${criteria.language.localLanguage || 'Local language'} proficiency (${criteria.language.localLanguageLevel || 'basic'} level) may be required for some programs.`
    );
  }

  return { eligible, reasons };
}

function checkFinancialEligibility(profile, criteria) {
  const reasons = [];
  let eligible = true;

  if (criteria.financial?.minimumBankBalance) {
    const userMax = profile.budgetRange?.max || 0;
    if (userMax < criteria.financial.minimumBankBalance) {
      eligible = false;
      reasons.push(
        `Minimum financial proof required: €${criteria.financial.minimumBankBalance.toLocaleString()}. Your budget: up to €${userMax.toLocaleString()}.`
      );
    }
  }

  if (criteria.financial?.averageTuitionMax) {
    reasons.push(
      `Average tuition range: €${(criteria.financial.averageTuitionMin || 0).toLocaleString()} - €${criteria.financial.averageTuitionMax.toLocaleString()} per year.`
    );
  }

  if (criteria.financial?.averageLivingCostPerYear) {
    reasons.push(
      `Estimated living costs: €${criteria.financial.averageLivingCostPerYear.toLocaleString()} per year.`
    );
  }

  return { eligible, reasons };
}

function checkVisaEligibility(profile, criteria) {
  const reasons = [];
  const eligible = true;

  if (criteria.visa?.processingTimeWeeks) {
    reasons.push(
      `Visa processing time: ${criteria.visa.processingTimeWeeks.min}-${criteria.visa.processingTimeWeeks.max} weeks.`
    );
  }

  if (criteria.visa?.workPermitWithStudy) {
    reasons.push(
      `Work permitted during studies: up to ${criteria.visa.maxWorkHoursPerWeek || 20} hours/week.`
    );
  }

  if (criteria.visa?.healthInsuranceRequired) {
    reasons.push('Health insurance is mandatory for student visa.');
  }

  return { eligible, reasons };
}

function evaluateEligibility(profile, country) {
  const criteria = country.eligibilityCriteria;
  if (!criteria) {
    return {
      country: country.name,
      status: 'unknown',
      explanation: 'No eligibility criteria available for this country.',
      details: {},
    };
  }

  const academic = checkAcademicEligibility(profile, criteria);
  const language = checkLanguageEligibility(profile, criteria);
  const financial = checkFinancialEligibility(profile, criteria);
  const visa = checkVisaEligibility(profile, criteria);

  const allEligible = academic.eligible && language.eligible && financial.eligible && visa.eligible;
  const noneEligible = !academic.eligible && !language.eligible && !financial.eligible;

  let status;
  if (allEligible) {
    status = 'eligible';
  } else if (noneEligible) {
    status = 'not_eligible';
  } else {
    status = 'partially_eligible';
  }

  const statusMessages = {
    eligible: `You appear to meet the eligibility requirements for studying in ${country.name}.`,
    partially_eligible: `You partially meet the eligibility requirements for ${country.name}. Review the details below.`,
    not_eligible: `Based on your current profile, you may not meet the requirements for ${country.name}. See details below.`,
  };

  return {
    country: country.name,
    countryCode: country.code,
    status,
    explanation: statusMessages[status],
    details: {
      academic: { eligible: academic.eligible, reasons: academic.reasons },
      language: { eligible: language.eligible, reasons: language.reasons },
      financial: { eligible: financial.eligible, reasons: financial.reasons },
      visa: { eligible: visa.eligible, reasons: visa.reasons },
    },
  };
}

function generateRecommendations(profile, countries, universities) {
  const results = [];

  for (const country of countries) {
    const eligibility = evaluateEligibility(profile, country);
    let score = 0;

    if (eligibility.status === 'eligible') score += 40;
    else if (eligibility.status === 'partially_eligible') score += 20;

    if (profile.preferredCountries?.includes(country.name)) score += 20;

    const countryUnis = universities.filter((u) => u.country === country.name);
    const affordableUnis = countryUnis.filter((u) => {
      const maxBudget = profile.budgetRange?.max || Infinity;
      return (u.tuitionRange?.max || 0) <= maxBudget;
    });

    if (affordableUnis.length > 0) score += 15;

    const matchingPrograms = countryUnis.filter((u) =>
      u.programs?.some(
        (p) => p.level === profile.preferredDegreeLevel
      )
    );
    if (matchingPrograms.length > 0) score += 15;

    const scholarshipUnis = countryUnis.filter((u) => u.scholarshipsAvailable);
    if (scholarshipUnis.length > 0) score += 10;

    results.push({
      country: country.name,
      countryCode: country.code,
      score,
      eligibility,
      matchingUniversities: affordableUnis.length,
      totalUniversities: countryUnis.length,
      recommendedUniversities: affordableUnis.slice(0, 3).map((u) => ({
        name: u.name,
        city: u.city,
        tuitionRange: u.tuitionRange,
        programCount: u.programs?.length || 0,
      })),
      nextSteps: generateNextSteps(eligibility, profile),
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

function generateNextSteps(eligibility, profile) {
  const steps = [];

  if (!eligibility.details.academic?.eligible) {
    steps.push('Improve academic qualifications or consider alternative programs.');
  }
  if (!eligibility.details.language?.eligible) {
    steps.push('Take an English proficiency test (IELTS/TOEFL) and achieve the required score.');
  }
  if (!eligibility.details.financial?.eligible) {
    steps.push('Explore scholarship opportunities or increase financial documentation.');
  }
  if (eligibility.status === 'eligible') {
    steps.push('Start gathering required documents for your application.');
    steps.push('Research specific university programs that match your interests.');
    steps.push('Begin the visa application process early.');
  }
  if (!profile.preferredDegreeLevel) {
    steps.push('Specify your preferred degree level to get better recommendations.');
  }

  return steps;
}

module.exports = { evaluateEligibility, generateRecommendations };
