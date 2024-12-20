export default {
  task: `
    <div class="task">
      {% if withZeroPage and task.zeropage_text %}
        <div class="zeroPage">
          <div class="zeroPage-title">Ознакомьтесь с информацией и выполните заданиe</div>
          <div>{{ task.zeropage_text | process | safe }}</div>
        </div>
      {% endif %}

      <div>{{ task.question | process | safe }}</div>

      <div>
        {% if task.type === 'ENTER_ANSWER' %}
          <br>
          <br>
          {% if answer %}
            <div>Ответ: {{ answer.answer[0] }}</div>
          {% else %}
            <div>Ответ: __________________________</div>
          {% endif %}

        {% elif task.type === 'CHOOSE_ANSWER' %}
          <br>
          <div class="list">
            {% for variant in task.variants %}
              <div>{{ variant.value }}) {{ variant.text | process | safe }}</div>
            {% endfor %}
          </div>

          <br>
          <br>
          <div class="task-answer">
            Ответ:
            <table class="task-answer-cells">
              <tbody>
                <tr>
                  {% if task.answer %}
                    {% if answer %}
                      {% for value in answer.answer %}
                        <td class="task-answer-cell">{{ value }}</td>
                      {% endfor %}
                    {% else %}
                      {% for value in task.answer %}
                        <td class="task-answer-cell"></td>
                      {% endfor %}
                    {% endif %}
                  {% else %}
                    <td class="task-answer-cell"></td>
                  {% endif %}
                </tr>
              </tbody>
            </table>
          </div>

        {% elif task.type === 'ORDER_ANSWER' %}
          <br>
          <div class="list">
            {% for variant in task.variants %}
              <div>{{ variant.value }}) {{ variant.text | process | safe }}</div>
            {% endfor %}
          </div>

          <br>
          <br>
          <div class="task-answer">
            Ответ:
            <table class="task-answer-cells">
              <tbody>
                <tr>
                  {% if task.answer %}
                    {% if answer %}
                      {% for value in answer.answer %}
                        <td class="task-answer-cell">{{ value }}</td>
                      {% endfor %}
                    {% else %}
                      {% for value in task.answer %}
                        <td class="task-answer-cell"></td>
                      {% endfor %}
                    {% endif %}
                  {% else %}
                    <td class="task-answer-cell"></td>
                  {% endif %}
                </tr>
              </tbody>
            </table>
          </div>

        {% elif task.type === 'FREE_ANSWER' %}
          {% if task.variants.length %}
            <div class="list">
              {% for variant in task.variants %}
                <div style="text-align: center;"><b>Вариант {{ variant.value }}</b></div>
                <div>{{ variant.text | process | safe }}</div>
              {% endfor %}
            </div>
          {% endif %}

          {% if answer and answer.answer and answer.answer.comment %}
            <br>
            <br>
            {% if answer.answer.variant %}
              <div>Вариант: {{ answer.answer.variant }}</div>
            {% endif %}            
            <div>Ответ: {{ answer.answer.comment }}</div>
          {% endif %}

        {% elif task.type === 'GAP_MATCH_TEXT_ANSWER' %}
          <br>
          {% for variant in task.variants %}
            <div>{{ variant.value }}) {{ variant.text | process | safe }}</div>
          {% endfor %}
          <br>
          <br>
          <div class="task-answer">
            Ответ:
            <table class="task-answer-cells">
              <tbody>
                {% if task.answer %}
                  <tr>
                    {% for value in task.answer %}
                      <td class="task-answer-cell">{{ alphabet[loop.index0] }}</td>
                    {% endfor %}
                  </tr>

                  <tr>
                    {% if answer %}
                      {% for value in answer.answer %}
                        <td class="task-answer-cell">{{ value }}</td>
                      {% endfor %}
                    {% else %}
                      {% for value in task.answer %}
                        <td class="task-answer-cell">&nbsp;</td>
                      {% endfor %}
                    {% endif %}
                  </tr>
                {% else %}
                  <tr>
                    <td class="task-answer-cell"></td>
                  </tr>
                {% endif %}
              </tbody>
            </table>
          </div>

        {% elif task.type === 'GAP_MATCH_TABLE_ANSWER' %}
          <br>
          <div style="display: flex;">
            <div style="width: 50%; padding-right: 30px;" class="list">
              {% for variant in task.variants_items %}
                <div>{{ alphabet[loop.index0] }}) {{ variant.text | process | safe }}</div>
              {% endfor %}
            </div>
            
            <div style="width: 50%; padding-left: 30px;" class="list">
              {% for variant in task.variants_groups %}
                <div>{{ loop.index }}) {{ variant.text | process | safe }}</div>
              {% endfor %}
            </div>
          </div>

          <br>
          <br>
          <div class="task-answer">
            Ответ:
            <table class="task-answer-cells">
              <tbody>
                {% if task.answer %}
                  <tr>
                    {% for value in task.answer %}
                      <td class="task-answer-cell">{{ alphabet[loop.index0] }}</td>
                    {% endfor %}
                  </tr>

                  <tr>
                    {% if answer %}
                      {% for value in task.answer %}
                        <td class="task-answer-cell">{{ getGroupIndex(task, answer, loop.index) }}</td>
                      {% endfor %}
                    {% else %}
                      {% for value in task.answer %}
                        <td class="task-answer-cell">&nbsp;</td>
                      {% endfor %}
                    {% endif %}
                  </tr>
                {% else %}
                  <tr>
                    <td class="task-answer-cell"></td>
                  </tr>
                {% endif %}
              </tbody>
            </table>
          </div>
        {% endif %}
      </div>

      {{ result | process | safe }}
      
      {% if answer and task.type === 'FREE_ANSWER' %}
        <div>Баллы: {{ answer.score }}</div>
      {% endif %}

      {% if withCorrectAnswer %}
        {% if task.type === 'FREE_ANSWER' and (criteria or answerText) %}
          <div class="task-correctAnswer">Критерии оценивания выполнения задания</div>
          {% if answerText %}
            {{ answerText | process | safe }}
          {% endif %}

          <div>{{ criteria | safe }}</div>
        {% endif %}

        {% if task.type !== 'FREE_ANSWER' %}
          <div class="task-correctAnswer">Ответ к заданию</div>
          <div>Ответ: {{ answerText }}</div>
        {% endif %}
      {% endif %}
    </div>
  `,
  answers: `
    <div class="test-correctAnswers">Ответы к заданиям</div>
    
    <table class="test-correctAnswers-table-4">
      <tbody>
        <tr>
          {% if tasks.length > 1 %}
            <td><b>Номер<br>задания</b></td>
            <td><b>Правильный<br>ответ</b></td>
            <td><b>Номер<br>задания</b></td>
            <td><b>Правильный<br>ответ</b></td>
          {% else %}
            <td><b>Номер задания</b></td>
            <td><b>Правильный ответ</b></td>
          {% endif %}
        </tr>

        {% for row in rows %}
          <tr>
            <td>{{ row[0].num }}</td>
            <td>{{ row[0].content | process | safe }}</td>
            {% if row[1] %}
              <td>{{ row[1].num }}</td>
              <td>{{ row[1].content | process | safe }}</td>
            {% elif tasks.length > 1 %}
              <td></td>
              <td></td>
            {% endif %}
          </tr>
        {% endfor %}
      </tbody>
    </table>
  `,
  criteria: `
    {% if raw %}
      {{ criteria[0].list[0].note | process | safe }}
    {% else %}
      <table class="task-criteria">
        <tbody>
          <tr>
            <td><b>Содержание критерия</b></td>
            <td><b>Баллы</b></td>
          </tr>

          {% for group in criteria %}
            {% if variants %}
              <tr>
                {% if group.number %}
                  <td colspan="2" align="center"><b>Вариант {{ group.number }}</b></td>
                {% else %}
                  <td colspan="2" align="center"><b>Общие критерии оценивания</b></td>
                {% endif %}
              </tr>
            {% endif %}

            {% for item in group.list %}
              {% if item.name %}
                <tr>
                  <td colspan="2">{{ item.name | process | safe }}</td>
                </tr>
              {% endif %}

              {% if item.note %}
                <tr>
                  <td colspan="2">{{ item.note | process | safe }}</td>
                </tr>
              {% endif %}

              {% for variant in item.variants %}
                <tr>
                  <td>{{ variant.content | process | safe }}</td>
                  <td class="task-criteria-score">{{ variant.score }}</td>
                </tr>
              {% endfor %}
            {% endfor %}

            {% if group.instructions %}
              <td colspan="2">{{ group.instructions | process | safe }}</td>
            {% endif %}
          {% endfor %}
        </tbody>
      </table>
    {% endif %}
  `,
  zeroPage: `
    <div class="zeroPage">
      <div class="zeroPage-title">{{ titleText }}</div>
      <div>{{ zeroPageText | process | safe }}</div>
    </div>
  `,
  testTask: `
    <div class="test-task">
      <div class="test-task-info">
        <div class="test-task-num">{{ counter }}</div>
        {% if tag %}
          <div class="test-task-tag">{{ tag }}</div>
        {% endif %}
      </div>
      <div>{{ task | safe }}</div>
    </div>
  `,
  criteriaTask: `
    <div class="test-task">
      <div class="test-task-info">
        <div class="test-task-num">{{ counter }}</div>
        {% if tag %}
          <div class="test-task-tag">{{ tag }}</div>
        {% endif %}
      </div>
      <div style="margin-bottom: 30px;">{{ task | safe }}</div>
      {% if answer %}
        <hr>
        {{ answer | process | safe }}
      {% endif %}

      {% if criteria %}
        {{ criteria | safe }}
      {% else %}
        <div><b>Критерии оценивания отсутствуют</b></div>
      {% endif %}
    </div>
  `
};
