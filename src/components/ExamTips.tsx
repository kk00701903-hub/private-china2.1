interface Props {
  onBack: () => void;
}

export default function ExamTips({ onBack }: Props) {
  return (
    <div className="flex flex-col h-full screen-pad gap-3 tablet:gap-4 min-h-0">
      <div className="flex-1 overflow-y-auto scroll-area min-h-0 space-y-4 tablet:space-y-5 pb-2">
        {/* Intro */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/25 to-slate-900/80 p-4 tablet:p-5 slide-up">
          <p className="text-xs tablet:text-sm text-purple-300 font-semibold mb-1">1학기 중간고사 대비</p>
          <h2 className="text-lg tablet:text-xl font-bold text-white leading-snug">
            시험 전, <span className="text-purple-300">단어·발음·회화·문화</span> 출제 패턴을 한눈에 확인하세요!
          </h2>
          <p className="text-sm tablet:text-base text-slate-400 mt-2 leading-relaxed">
            아래 내용은 실제 기출 분석을 바탕으로 정리했어요. 어디에 공을 들일지 알면 1등급도 충분히 노릴 수 있습니다.
          </p>
        </div>

        {/* ── Part 1: 단어 ── */}
        <div className="exam-tip-part-divider">
          <span>📖 단어 영역</span>
        </div>
        {/* 🎯 핵심 요약 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">🎯 핵심 요약</h3>
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4 tablet:p-5 space-y-4">
            <p className="text-sm tablet:text-base text-slate-300 leading-relaxed">
              고등학교 중국어 <strong className="text-white font-bold">중간고사</strong>는 보통 객관식{' '}
              <strong className="text-cyan-300 font-bold">40문항</strong>으로 출제됩니다.
            </p>
            <div className="grid grid-cols-2 gap-2 tablet:gap-3">
              <div className="exam-tip-stat">
                <span className="exam-tip-stat-label">단어 문제</span>
                <span className="exam-tip-stat-value text-cyan-300">10~12문항</span>
              </div>
              <div className="exam-tip-stat">
                <span className="exam-tip-stat-label">전체 비중</span>
                <span className="exam-tip-stat-value text-purple-300">약 25~30%</span>
              </div>
            </div>
            <p className="text-sm tablet:text-base text-slate-400 leading-relaxed border-t border-slate-700/60 pt-3">
              40문항 중 <strong className="text-cyan-200">4~5문항마다 1개</strong>는 단어와 관련된 문제예요.
              단어는 &ldquo;보너스 파트&rdquo;가 아니라 <strong className="text-white">실력을 가르는 핵심 영역</strong>입니다.
              지금 이 앱에서 익히는 4·5·6장 단어가 그대로 시험 범위와 연결돼요!
            </p>
          </div>
        </section>

        {/* 📝 자주 나오는 단어 문제 유형 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">📝 자주 나오는 단어 문제 유형</h3>
          <p className="text-xs tablet:text-sm text-slate-500 mb-3 -mt-1">
            기출에서 반복되는 4가지 패턴 — 유형별로 연습하면 실전 감각이 빨리 올라가요.
          </p>
          <ol className="space-y-3">
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">1</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">직관적 의미 연결</p>
                <p className="text-xs tablet:text-sm text-slate-400 mt-1 leading-relaxed">
                  중국어 단어를 보고 알맞은 <strong className="text-slate-300">한국어·영어 뜻</strong>을 고르는 문제예요.
                </p>
                <p className="text-sm text-purple-200/90 chinese-font mt-2">
                  谁 <span className="text-slate-500 font-sans text-xs">→</span> Who
                </p>
              </div>
            </li>
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">2</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">범주 및 성격 분류</p>
                <p className="text-xs tablet:text-sm text-slate-400 mt-1 leading-relaxed">
                  보기 5개 중 <strong className="text-slate-300">주제·범주가 다른 단어</strong> 하나를 찾아내요.
                  동물, 가족 호칭, 국가명 등 한 그룹에 속하지 않는 &ldquo;이질적인&rdquo; 단어가 정답!
                </p>
              </div>
            </li>
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">3</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">문맥 맞춤형 단어</p>
                <p className="text-xs tablet:text-sm text-slate-400 mt-1 leading-relaxed">
                  짧은 <strong className="text-slate-300">대화나 문장의 빈칸</strong>에 들어갈 대명사·부사·어휘를 고르는 유형이에요.
                  단어 뜻만 아는 것보다 <em className="text-cyan-300/90 not-italic">어디에 쓰이는지</em>까지 알아야 해요.
                </p>
              </div>
            </li>
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">4</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">외래어 발음 찾기</p>
                <p className="text-xs tablet:text-sm text-slate-400 mt-1 leading-relaxed">
                  영어 발음과 유사한 <strong className="text-slate-300">중국어 외래어 표기</strong>를 연결하는 문제예요.
                </p>
                <p className="text-sm text-purple-200/90 mt-2">
                  ice cream <span className="text-slate-500 text-xs">→</span>{' '}
                  <span className="chinese-font">bīngqílín</span>{' '}
                  <span className="text-slate-500 text-xs">(冰淇淋)</span>
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* 💡 고득점 대비 팁 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">💡 고득점 대비 팁</h3>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 tablet:p-5 space-y-3">
            <ul className="space-y-3 text-sm tablet:text-base text-slate-300 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-amber-400 shrink-0">✦</span>
                <span>
                  <strong className="text-amber-200">한 글자씩 외우기만 하면</strong> 범주·문맥 유형에서 자주 틀려요.
                  &ldquo;장소&rdquo;, &ldquo;동작&rdquo;, &ldquo;시간&rdquo;처럼 <strong className="text-white">묶어서</strong> 정리해 보세요.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 shrink-0">✦</span>
                <span>
                  이 앱의 <strong className="text-white">연상암기</strong>로 한자 구조를 잡고,{' '}
                  <strong className="text-white">퀴즈</strong>로 4가지 유형을 미리 경험해 두면 시험장에서 당황하지 않아요.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 shrink-0">✦</span>
                <span>
                  틀린 단어는 <strong className="text-white">다시볼게</strong> 표시 후, 같은 범주 단어와 비교하며 복습하면
                  기억이 오래 갑니다.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 shrink-0">✦</span>
                <span>
                  단어 10~12문항은 <strong className="text-cyan-300">최소 8~10점</strong>을 노릴 수 있는 구간이에요.
                  꾸준히만 하면 다른 영역보다 <strong className="text-white">확실한 득점 포인트</strong>가 됩니다!
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Part 2: 단어 외 ── */}
        <div className="exam-tip-part-divider">
          <span>🔊 단어 외 영역</span>
        </div>

        {/* 📊 핵심 출제 영역 요약 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">📊 핵심 출제 영역 요약</h3>
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-4 tablet:p-5 space-y-4">
            <p className="text-sm tablet:text-base text-slate-300 leading-relaxed">
              객관식 40문항 중 <strong className="text-white">단어를 제외한 문제</strong>가 약{' '}
              <strong className="text-blue-300 font-bold">28~30문항</strong> — 전체의{' '}
              <strong className="text-blue-300 font-bold">70~75%</strong>를 차지합니다.
            </p>
            <div className="grid grid-cols-2 gap-2 tablet:gap-3">
              <div className="exam-tip-stat">
                <span className="exam-tip-stat-label">단어 외 문제</span>
                <span className="exam-tip-stat-value text-blue-300">28~30문항</span>
              </div>
              <div className="exam-tip-stat">
                <span className="exam-tip-stat-label">전체 비중</span>
                <span className="exam-tip-stat-value text-indigo-300">약 70~75%</span>
              </div>
            </div>
            <div className="exam-tip-callout">
              <p className="text-sm tablet:text-base text-slate-200 leading-relaxed">
                <strong className="text-blue-200">🏆 1등급의 핵심은 발음·병음!</strong>
                <br />
                단어 외 영역 가운데 <strong className="text-white">발음 및 병음 규칙</strong>이 가장 높은 비중을 차지해요.
                병음 한 문제, 성조 한 문제가 등급을 가르는 경우가 많습니다. &ldquo;대충 아는 것 같다&rdquo;가 아니라{' '}
                <strong className="text-cyan-300">규칙까지 정확히</strong> 잡아 두세요!
              </p>
            </div>
          </div>
        </section>

        {/* 🔍 영역별 문제 유형 파헤치기 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">🔍 영역별 문제 유형 파헤치기</h3>
          <p className="text-xs tablet:text-sm text-slate-500 mb-3 -mt-1">
            단어 외 3대 영역 — 시험지에서 어디를 조심해야 하는지 미리 파악해 두세요.
          </p>
          <ol className="space-y-3">
            <li className="exam-tip-type-card border-blue-500/20">
              <span className="exam-tip-type-num bg-blue-500/15 border-blue-500/35 text-blue-300">1</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">
                  발음 및 병음 규칙
                  <span className="ml-2 text-[0.65rem] tablet:text-xs font-bold text-blue-300 px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
                    최고 비중
                  </span>
                </p>
                <ul className="mt-2 space-y-1.5 text-xs tablet:text-sm text-slate-400 leading-relaxed">
                  <li className="flex gap-1.5">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span>성모·운모·성조 개념 및 <strong className="text-slate-300">기본 발음</strong> 찾기</span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">성조 표기 위치</strong> — 모음이 여러 개일 때 어디에 표기하는지
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">병음 예외 규칙</strong> — j, q, x 뒤 ü의 점(¨) 생략 등
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">성조 변화</strong> — 반3성(두 3성 연속), 경성(不·一) 적용
                    </span>
                  </li>
                </ul>
              </div>
            </li>
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">2</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">기초 회화 및 의사소통</p>
                <ul className="mt-2 space-y-1.5 text-xs tablet:text-sm text-slate-400 leading-relaxed">
                  <li className="flex gap-1.5">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">짝을 이루는 표현</strong> 찾기 — 미안해와 괜찮아처럼 자연스럽게 이어지는 호응
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">상황에 맞는 표현</strong> — 이름·국적·나이를 묻고 답하는 기본 대화
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-purple-200/90 chinese-font mt-2.5">
                  对不起 <span className="text-slate-500 font-sans text-xs">↔</span> 没关系
                  <span className="text-slate-500 font-sans text-xs ml-2">(미안해 ↔ 괜찮아)</span>
                </p>
              </div>
            </li>
            <li className="exam-tip-type-card">
              <span className="exam-tip-type-num">3</span>
              <div>
                <p className="font-bold text-white text-sm tablet:text-base">중국 문화 및 상식</p>
                <ul className="mt-2 space-y-1.5 text-xs tablet:text-sm text-slate-400 leading-relaxed">
                  <li className="flex gap-1.5">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>
                      교과서 <strong className="text-slate-300">&lsquo;문화 읽기&rsquo;</strong> 코너에서 그대로·변형 출제
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">지리·명소</strong> — 직할시, 천안문 등 중국 대표 장소
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">인구·음식</strong> — 인구 규모, 탕후루(糖葫芦) 등
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-300">숫자·학제 문화</strong> — 손가락 수 표현, 길한 숫자 8, 가오카오(高考)
                    </span>
                  </li>
                </ul>
              </div>
            </li>
          </ol>
        </section>

        {/* 🚀 1등급 달성 전략 */}
        <section className="exam-tip-section">
          <h3 className="exam-tip-heading">🚀 1등급 달성 전략</h3>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 tablet:p-5 space-y-3">
            <ul className="space-y-3 text-sm tablet:text-base text-slate-300 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✦</span>
                <span>
                  <strong className="text-emerald-200">병음 규칙은 &lsquo;외울수록 이득&rsquo;</strong> — 성조 위치, ü 예외, 不·一 변调를
                  오답 노트에 따로 모아 두세요. 기출에서 <strong className="text-white">같은 유형이 반복</strong>됩니다.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✦</span>
                <span>
                  회화는 교과서 <strong className="text-white">대화문을 소리 내어</strong> 읽으며 짝 표현을 암기하세요.
                  빈칸·호응 유형은 패턴이 정해져 있어요.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✦</span>
                <span>
                  문화 파트는 <strong className="text-white">문화 읽기 본문을 정독</strong>하는 것만으로도 대부분 커버됩니다.
                  밑줄·굵은 글씨·표·그림 캡션까지 놓치지 마세요!
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✦</span>
                <span>
                  단어(25~30%) + 단어 외(70~75%)를 <strong className="text-cyan-300">균형 있게</strong> 준비하면
                  40문항 중 <strong className="text-white">32~36문항</strong>을 안정적으로 맞힐 수 있어요.
                  충분히 1등급, 도전해 보세요! 💪
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="shrink-0 touch-target-lg py-3 tablet:py-4 rounded-xl border border-purple-500/50 bg-purple-500/15 text-purple-200 font-bold text-sm tablet:text-base"
      >
        ← 홈으로
      </button>
    </div>
  );
}
