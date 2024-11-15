import { Doughnut } from 'react-chartjs-2';
import cn from 'classnames';
import { getTopFrequentElements } from 'helpers/getTopFrequentElements';
import styles from 'pages/Dashboard/Dashboard.scss';

export const OrganizationsBreakdown = ({ organizations, projects }) => {
  const getBiggestOrganization = (organizations, projects) => {
    const topOrganizationID = getTopFrequentElements(projects.map(({ organizationID }) => organizationID));
    const topOrganization = organizations.find(({ id }) => Number(topOrganizationID) === id);

    return topOrganization?.name;
  };

  const organizationBreakdownData = (organizations, projects) => {
    const projectCounts = organizations.map(
      (org) => projects.filter((project) => project.organizationID === org.id).length
    );
    const clearedProjectsCount = projectCounts.filter((count) => count);
    const organizationIDs = projects.map(({ organizationID }) => organizationID);

    return {
      labels: organizations.filter(({ id }) => [...new Set(organizationIDs)].includes(id)).map(({ name }) => name),
      datasets: [
        {
          label: 'Number of projects',
          data: clearedProjectsCount,
          backgroundColor: ['#d5e4fa', '#e5d6fb', '#fbd4f5', '#fffdc7'],
        },
      ],
    };
  };

  return (
    <div className={cn(styles.card, styles.projects)}>
      <h3 className={styles.title}>Organizations breakdown</h3>
      <div className={styles.tag}>
        <span className={styles.subtitle}>The biggest organization</span>
        <span className={styles.number}>{getBiggestOrganization(organizations, projects)}</span>
      </div>
      <div className={styles.donutContainer}>
        <Doughnut
          height='100%'
          width='100%'
          className={styles.chart}
          data={organizationBreakdownData(organizations, projects)}
          options={doughnutChartOptions}
        />
      </div>
    </div>
  );
};

const doughnutChartOptions = {
  responsive: true,
  circumference: 180,
  rotation: -90,
  cutout: '70%',
  spacing: -1,
  radius: 170,
  borderWidth: 0,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,

      external: function (context) {
        let tooltipEl = document.getElementById('chartjs-tooltip');

        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          tooltipEl.innerHTML = '<table></table>';
          document.body.appendChild(tooltipEl);
        }

        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }

        tooltipEl.classList.remove('above', 'below', 'no-transform');
        tooltipEl.classList.add(styles.tooltip);
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        if (tooltipModel.body) {
          const titleLines = tooltipModel.title || [];
          const bodyLines = tooltipModel.body.map(getBody);

          let innerHtml = '<thead>';

          titleLines.forEach(function (title) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
          });
          innerHtml += '</thead><tbody>';

          bodyLines.forEach(function (body, i) {
            const span = '<span>' + body + '</span>';
            innerHtml += '<tr><td>' + span + '</td></tr>';
          });
          innerHtml += '</tbody>';

          let tableRoot = tooltipEl.querySelector('table');
          tableRoot.innerHTML = innerHtml;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
        tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
        tooltipEl.style.pointerEvents = 'none';
      },
    },
  },
};
