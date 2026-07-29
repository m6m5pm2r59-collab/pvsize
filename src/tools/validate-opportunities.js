const fs = require('fs');
const path = require('path');

const dataRoot = path.join(__dirname, '..', 'data', 'opportunities');
const reviewNotesRoot = path.join(dataRoot, 'review-notes');
const today = new Date().toISOString().slice(0, 10);

const sourceTypes = new Set([
  'government-procurement',
  'utility-procurement',
  'agency-program',
  'company-rfi',
  'official-newsroom',
  'association',
]);

function readJson(fileName) {
  const filePath = path.join(dataRoot, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isIsoDate(value) {
  return value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isUrl(value) {
  return typeof value === 'string' && /^https?:\/\/\S+$/i.test(value);
}

function asSet(values, label, errors) {
  if (!Array.isArray(values) || values.length === 0) {
    errors.push(`tags.json ${label} must be a non-empty array`);
    return new Set();
  }
  return new Set(values);
}

function requireFields(record, fields, label, errors) {
  fields.forEach((field) => {
    if (!(field in record)) {
      errors.push(`${label} missing required field: ${field}`);
    }
  });
}

function validateRoots(opportunities, sources, tags, errors) {
  if (!opportunities.schema_version) errors.push('opportunities.json missing schema_version');
  if (!sources.schema_version) errors.push('sources.json missing schema_version');
  if (!tags.schema_version) errors.push('tags.json missing schema_version');
  if (!Array.isArray(opportunities.records)) errors.push('opportunities.json records must be an array');
  if (!Array.isArray(sources.sources)) errors.push('sources.json sources must be an array');
}

function validateSources(sources, taxonomy, errors) {
  const seenIds = new Set();
  const byId = new Map();
  const required = [
    'id',
    'name',
    'url',
    'country',
    'source_type',
    'allowed_use_notes',
    'reliability_score',
    'last_checked',
    'status',
  ];

  sources.sources.forEach((source, index) => {
    const label = `sources[${index}]`;
    requireFields(source, required, label, errors);

    if (source.id) {
      if (seenIds.has(source.id)) errors.push(`${label} duplicate id: ${source.id}`);
      seenIds.add(source.id);
      byId.set(source.id, source);
    }
    if (source.url && !isUrl(source.url)) errors.push(`${label} url must be http(s) URL`);
    if (source.country && !taxonomy.countries.has(source.country)) {
      errors.push(`${label} country is not controlled taxonomy: ${source.country}`);
    }
    if (source.source_type && !sourceTypes.has(source.source_type)) {
      errors.push(`${label} source_type is not allowed: ${source.source_type}`);
    }
    if (source.status && !taxonomy.reviewStatuses.has(source.status)) {
      errors.push(`${label} status is not controlled review status: ${source.status}`);
    }
    if (source.last_checked && !isIsoDate(source.last_checked)) {
      errors.push(`${label} last_checked must be ISO date`);
    }
    if (
      typeof source.reliability_score !== 'undefined' &&
      (!Number.isInteger(source.reliability_score) || source.reliability_score < 0 || source.reliability_score > 100)
    ) {
      errors.push(`${label} reliability_score must be integer 0-100`);
    }
  });

  return byId;
}

function validateOpportunities(opportunities, sourcesById, taxonomy, errors) {
  const seenIds = new Set();
  const seenSlugs = new Set();
  const required = [
    'id',
    'slug',
    'title',
    'status',
    'country',
    'region',
    'opportunity_type',
    'technology',
    'buyer_or_issuer',
    'published_date',
    'deadline',
    'source_language',
    'last_verified',
    'official_source_url',
    'overview',
    'review_status',
    'quality_score',
  ];

  opportunities.records.forEach((record, index) => {
    const label = `opportunities[${index}]`;
    requireFields(record, required, label, errors);

    if (record.id) {
      if (seenIds.has(record.id)) errors.push(`${label} duplicate id: ${record.id}`);
      seenIds.add(record.id);
      validateReviewNote(record, label, errors);
    }
    if (record.country && record.slug) {
      const key = `${record.country}/${record.slug}`;
      if (seenSlugs.has(key)) errors.push(`${label} duplicate country slug: ${key}`);
      seenSlugs.add(key);
    }
    if (record.country && !taxonomy.countries.has(record.country)) {
      errors.push(`${label} country is not controlled taxonomy: ${record.country}`);
    }
    if (record.opportunity_type && !taxonomy.opportunityTypes.has(record.opportunity_type)) {
      errors.push(`${label} opportunity_type is not controlled taxonomy: ${record.opportunity_type}`);
    }
    if (record.status && !taxonomy.statuses.has(record.status)) {
      errors.push(`${label} status is not controlled taxonomy: ${record.status}`);
    }
    if (record.review_status && !taxonomy.reviewStatuses.has(record.review_status)) {
      errors.push(`${label} review_status is not controlled taxonomy: ${record.review_status}`);
    }
    if (!Array.isArray(record.technology) || record.technology.length === 0) {
      errors.push(`${label} technology must be a non-empty array`);
    } else {
      record.technology.forEach((tag) => {
        if (!taxonomy.technologies.has(tag)) errors.push(`${label} technology is not controlled taxonomy: ${tag}`);
      });
    }
    if (!isIsoDate(record.published_date)) errors.push(`${label} published_date must be ISO date or empty string`);
    if (!isIsoDate(record.deadline)) errors.push(`${label} deadline must be ISO date or empty string`);
    if (!isIsoDate(record.last_verified)) errors.push(`${label} last_verified must be ISO date or empty string`);
    if (!Number.isInteger(record.quality_score) || record.quality_score < 0 || record.quality_score > 100) {
      errors.push(`${label} quality_score must be integer 0-100`);
    }

    if (record.review_status === 'approved' && record.quality_score < 70) {
      errors.push(`${label} approved records require quality_score >= 70`);
    }
    if (record.review_status === 'published' && record.quality_score < 80) {
      errors.push(`${label} published records require quality_score >= 80`);
    }
    if ((record.review_status === 'approved' || record.review_status === 'published') && !record.last_verified) {
      errors.push(`${label} approved/published records require last_verified`);
    }
    if (record.official_source_url && !isUrl(record.official_source_url)) {
      errors.push(`${label} official_source_url must be http(s) URL`);
    }
    if (!record.source_id) {
      errors.push(`${label} missing required source_id`);
    } else {
      const source = sourcesById.get(record.source_id);
      if (!source) {
        errors.push(`${label} source_id does not reference an existing source: ${record.source_id}`);
      } else {
        if (source.status !== 'approved') {
          errors.push(`${label} source_id must reference an approved source: ${record.source_id}`);
        }
        if (record.country && source.country && record.country !== source.country) {
          errors.push(`${label} country must match source country: ${record.country} != ${source.country}`);
        }
        if (
          typeof record.source_reliability !== 'undefined' &&
          typeof source.reliability_score !== 'undefined' &&
          record.source_reliability !== source.reliability_score
        ) {
          errors.push(`${label} source_reliability must match source reliability_score for ${record.source_id}`);
        }
      }
    }
    if (record.review_status === 'published') {
      if (!record.official_source_url) errors.push(`${label} published records require official_source_url`);
      if (
        record.deadline &&
        record.deadline < today &&
        !['closed', 'cancelled', 'superseded'].includes(record.status)
      ) {
        errors.push(`${label} published record has past deadline but active status: ${record.deadline}`);
      }
    }
  });
}

function validateReviewNote(record, label, errors) {
  const filePath = path.join(reviewNotesRoot, `${record.id}.md`);
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} missing review note: review-notes/${record.id}.md`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const requiredMarkers = [
    `- ID: \`${record.id}\``,
    'Reviewer:',
    'Review date:',
    'Decision:',
    'Source:',
    'Verification:',
    '## Current Evidence',
    '## Checks Required Before `needs_review`',
    '## Checks Required Before `approved`',
    '## Publication Gate Reminder',
  ];

  requiredMarkers.forEach((marker) => {
    if (!content.includes(marker)) {
      errors.push(`${label} review note missing marker: ${marker}`);
    }
  });

  const sourceLine = `Source: ${record.source_id}`;
  if (record.source_id && !content.includes(sourceLine)) {
    errors.push(`${label} review note source does not match record source_id`);
  }
}

function validateData(opportunities, sources, tags) {
  const errors = [];
  validateRoots(opportunities, sources, tags, errors);

  const taxonomy = {
    countries: asSet(tags.countries, 'countries', errors),
    technologies: asSet(tags.technologies, 'technologies', errors),
    opportunityTypes: asSet(tags.opportunity_types, 'opportunity_types', errors),
    statuses: asSet(tags.statuses, 'statuses', errors),
    reviewStatuses: asSet(tags.review_statuses, 'review_statuses', errors),
  };

  const sourcesById = Array.isArray(sources.sources) ? validateSources(sources, taxonomy, errors) : new Map();
  if (Array.isArray(opportunities.records)) validateOpportunities(opportunities, sourcesById, taxonomy, errors);

  return errors;
}

function runSelfTest(opportunities, sources, tags) {
  const baseRecord = opportunities.records[0];
  if (!baseRecord) {
    throw new Error('Self-test requires at least one valid opportunity record');
  }

  const cases = [
    {
      name: 'missing source_id',
      mutate(testOpportunities) {
        delete testOpportunities.records[0].source_id;
      },
      expected: 'missing required source_id',
    },
    {
      name: 'unknown source_id',
      mutate(testOpportunities) {
        testOpportunities.records[0].source_id = 'src_missing_source';
      },
      expected: 'source_id does not reference an existing source',
    },
    {
      name: 'non-approved source_id',
      mutate(testOpportunities) {
        testOpportunities.records[0].source_id = 'src_eu_ted';
      },
      expected: 'source_id must reference an approved source',
    },
    {
      name: 'country mismatch',
      mutate(testOpportunities) {
        testOpportunities.records[0].country = 'japan';
      },
      expected: 'country must match source country',
    },
    {
      name: 'missing review note',
      mutate(testOpportunities) {
        testOpportunities.records[0].id = 'opp_missing_review_note';
      },
      expected: 'missing review note',
    },
  ];

  cases.forEach((testCase) => {
    const testOpportunities = clone(opportunities);
    testCase.mutate(testOpportunities);
    const errors = validateData(testOpportunities, sources, tags);
    if (!errors.some((error) => error.includes(testCase.expected))) {
      throw new Error(`${testCase.name} did not fail with expected error: ${testCase.expected}`);
    }
    console.log(`Self-test PASS: ${testCase.name}`);
  });
}

function main() {
  const opportunities = readJson('opportunities.json');
  const sources = readJson('sources.json');
  const tags = readJson('tags.json');
  const errors = validateData(opportunities, sources, tags);

  if (errors.length) {
    console.error(`Opportunities validation failed: ${errors.length} issue(s)`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Opportunities validation PASS: ${opportunities.records.length} records, ${sources.sources.length} sources`);

  if (process.argv.includes('--self-test')) {
    runSelfTest(opportunities, sources, tags);
  }
}

main();
