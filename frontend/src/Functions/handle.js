export function formatAddColors(data) {
    for (let i = 0; i < data.fossils.length; i++) {
        const {
            label,
        } = data.fossils[i];
        if (label === 'uranus') {
            data.fossils[i].className = 'stat_block_item_title_brown';
        } else if (label === 'metal') {
            data.fossils[i].className = 'stat_block_item_title_metal';
        } else if (label === 'hydrogen') {
            data.fossils[i].className = 'stat_block_item_title_lightgreen';
        } else if (label === 'oxygen') {
            data.fossils[i].className = 'stat_block_item_title_purple';
        }
    }

    for (let i = 0; i < data.producers.length; i++) {
        if (data.producers[i].citizens) {
            data.population = [{
                label: 'citizens',
                count: data.producers[i].citizens,
                className: 'stat_block_item_title_yellow'
            }];
        } else if (data.producers[i].plants) {
            data.plants = [{
                label: 'plants',
                count: data.producers[i].plants,
                className: 'stat_block_item_title_orange'
            }];
        } else if (data.producers[i].mining_machines) {
            data.technique = [{
                label: 'war_machines',
                count: data.producers[i].mining_machines,
                className: 'stat_block_item_title_brown2'
            }];
        }
    }

    delete data.producers;

    // for (let i = 0; i < data.population.length; i++) {
    //     const {
    //         label,
    //     } = data.population[i];
    //     if (label === 'citizens') {
    //         data.population[i].className = 'stat_block_item_title_yellow';
    //     } else if (label === 'colonizers') {
    //         data.population[i].className = 'stat_block_item_title_green';
    //     } else if (label === 'smugglers') {
    //         data.population[i].className = 'stat_block_item_title_blue';
    //     } else if (label === 'seers') {
    //         data.population[i].className = 'stat_block_item_title_red';
    //     }
    // }

    // for (let i = 0; i < data.plants.length; i++) {
    //     const {
    //         label,
    //     } = data.plants[i];
    //     if (label === 'predatory plants') {
    //         data.plants[i].className = 'stat_block_item_title_orange';
    //     } else if (label === 'earth plants') {
    //         data.plants[i].className = 'stat_block_item_title_doublegreen';
    //     }
    // }

    // for (let i = 0; i < data.technique.length; i++) {
    //     const {
    //         label,
    //     } = data.technique[i];
    //     if (label === 'military vehicle') {
    //         data.technique[i].className = 'stat_block_item_title_brown2';
    //     } else if (label === 'mining machine') {
    //         data.technique[i].className = 'stat_block_item_title_brown3';
    //     } else if (label === 'industrial building') {
    //         data.technique[i].className = 'stat_block_item_title_green2';
    //     }
    // }

    return data;
}
export function formatName(name) {
    const text = name[0].toUpperCase() + name.slice(1);
    return text.replaceAll('_', ' ');
}